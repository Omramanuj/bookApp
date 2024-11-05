package controllers

import (
	"time"
	"log"

	"github.com/Omramanuj/bookApp/server/database"
	"github.com/Omramanuj/bookApp/server/middleware"
	"github.com/Omramanuj/bookApp/server/models"
	"github.com/gofiber/fiber/v2"
	
)


func SaveBook(c *fiber.Ctx) error {
	
		type request struct {
			FileName string `json:"url"`
			Url string `json:"url"`
		}

		var req request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
		}
		cookie := c.Cookies("jwt")
		userId, err := middleware.ValidateJWT(cookie) 
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		db := database.ConnectDB()
		newBook := models.Book{
			Title:         req.FileName, 
			Author:        "Unknown Author", 
			PublishedDate: time.Now(),
			ISBN:          "Unknown ISBN", 
			UserID:        userId,
			URL:           req.Url,
			CreatedAt:     time.Now(),
		}
		
		if err := db.Create(&newBook).Error; err != nil {
			return err
		}


		var user models.User
		if err := db.Preload("Books").First(&user, userId).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch user"})
		}

		return c.JSON(fiber.Map{
			"status": "success",
			"message": "Book saved successfully",
			"user": user,
		})
	}

	func GetBooks(c *fiber.Ctx) error {
		cookie := c.Cookies("jwt")
		userId,err := middleware.ValidateJWT(cookie)
		
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
		}

		db := database.ConnectDB()
		var books []models.Book
		if err := db.Where("user_id = ?", userId).Find(&books).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch books"})
		}

		type BookResponse struct {
			models.Book         
			PreSignedURL string `json:"presigned_url"`
		}

		booksResponse := make([]BookResponse, len(books))

		for i, book := range books { 
		
			presignedURL, err := middleware.GetPresignURL(book.URL)
        if err != nil {
            log.Printf("Failed to generate presigned URL for book %s: %v", book.Title, err)
            continue
		}

		booksResponse[i] = BookResponse{
            Book:         book,
            PreSignedURL: presignedURL.PreSignedURL,
        }
	}
	log.Print(booksResponse)
		return c.JSON(booksResponse)
	}