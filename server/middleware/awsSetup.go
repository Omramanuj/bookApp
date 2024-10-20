package middleware

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

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

func GetPresignURL(fileName string) (string,error ){

	presignClient := s3.NewPresignClient(s3Client)
	presignedUrl, err := presignClient.PresignPutObject(context.Background(),
		&s3.PutObjectInput{
			Bucket: aws.String(s3Bucket),
			Key:    aws.String(fileName),
		},
		s3.WithPresignExpires(time.Minute*15))
	if err != nil {
		log.Fatal(err)
	}
	return presignedUrl.URL,nil
}
