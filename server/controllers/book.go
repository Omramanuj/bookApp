package controllers

import (
	"time"

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
		// saving book first 
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

		// now lets check if its in user

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
	