package middleware

import (
	"context"
	"fmt"
	"os"
	"time"
	"log"
	"strings"
	"net/url" 
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

var (
	s3Client *s3.Client
	s3Bucket string
)

type Presigner struct {
	PresignClient *s3.PresignClient
}

type PresignedURLResponse struct {
	PreSignedURL string `json:"preSignedUrl"`
	ObjectURI    string `json:"objectUri"`
}

func InitAWS() error {
	accessKey := os.Getenv("aws_access_key_id")
	secretAccessKey := os.Getenv("aws_secret_access_key")
	s3Bucket = os.Getenv("AWS_S3_BUCKET")
	region := "eu-north-1"

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(region),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretAccessKey, "")),
	)
	if err != nil {
		return fmt.Errorf("unable to load SDK config, %w", err)
	}

	s3Client = s3.NewFromConfig(cfg)
	return nil
}

func PostPresignURL(fileName string) (PresignedURLResponse, error) {
	presignClient := s3.NewPresignClient(s3Client)
	presignedUrl, err := presignClient.PresignPutObject(context.Background(),
		&s3.PutObjectInput{
			Bucket: aws.String(s3Bucket),
			Key:    aws.String(fileName),
		},
		s3.WithPresignExpires(time.Minute*15))
	if err != nil {
		log.Printf("Failed to generate presigned URL: %v", err)
		return PresignedURLResponse{}, err
	}



	return PresignedURLResponse{
		PreSignedURL: presignedUrl.URL,

	}, nil
}

func GetPresignURL(s3URL string) (PresignedURLResponse, error) {
	presignClient := s3.NewPresignClient(s3Client)
	keyURL := extractKeyFromURL(s3URL)
	log.Println(keyURL)
	presignedUrl, err := presignClient.PresignGetObject(context.Background(),
		&s3.GetObjectInput{
			Bucket: aws.String(s3Bucket),
			Key:    aws.String(keyURL),
		},
		s3.WithPresignExpires(time.Minute*1500))
	if err != nil {
		log.Printf("Failed to generate presigned URL: %v", err)
		return PresignedURLResponse{}, err
	}

	return PresignedURLResponse{
		PreSignedURL: presignedUrl.URL,
	}, nil
}


func extractKeyFromURL(s3URL string) string {
	if !strings.Contains(s3URL, "http") && !strings.Contains(s3URL, "s3://") {
        return s3URL
    }
	u, err := url.Parse(s3URL)
    if err != nil {
        return s3URL
    }
	return strings.TrimPrefix(u.Path, "/")
}