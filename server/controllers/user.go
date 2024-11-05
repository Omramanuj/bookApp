package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"github.com/Omramanuj/bookApp/server/database"
	"github.com/Omramanuj/bookApp/server/middleware"
	"github.com/Omramanuj/bookApp/server/models"
)

func LoginOrRegister(c *fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	db := database.ConnectDB()
	var user models.User

	result := db.Where("email = ?", input.Email).First(&user)
	if result.Error != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
		}

		newUser := models.User{
			Email:    input.Email,
			Password: string(hashedPassword),
		}

		if err := db.Create(&newUser).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
		}

		user = newUser
	} else {
		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
		}
	}

	tokenString, err := middleware.GenerateJWT(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    tokenString,
		Expires:  time.Now().Add(24 * time.Hour),
		Secure:   true,
		HTTPOnly: true,
	})

	return c.JSON(fiber.Map{
		"token": tokenString,
		"user":  user,
	})
}

func GetUser(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	userID, err := middleware.ValidateJWT(cookie)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var user models.User
	if err := database.ConnectDB().First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	c.ClearCookie("jwt")
	return c.JSON(fiber.Map{"message": "Logout successful"})
}

func GetBookURL(c *fiber.Ctx) error {
	
	
	type request struct {
		FileName string `json:"filename"`
	}

	var req request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}


	response, err := middleware.PostPresignURL(req.FileName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate presigned URL"})
	}

	return c.JSON(fiber.Map{
		"preSignedUrl": response.PreSignedURL,
		"fileName":     req.FileName,
	})
}

func GetUserIDFromToken(c *fiber.Ctx) (uint, error) {
	cookie := c.Cookies("jwt")
	userID, err := middleware.ValidateJWT(cookie)
	if err != nil {
		return 0, err
	}
	return uint(userID), nil
}

