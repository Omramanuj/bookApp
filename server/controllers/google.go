package controllers

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/Omramanuj/bookApp/server/config"
	"github.com/Omramanuj/bookApp/server/database"
	"github.com/Omramanuj/bookApp/server/middleware"
	"github.com/Omramanuj/bookApp/server/models"
)
func GoogleLogin(c *fiber.Ctx) error {
	url := config.AppConfig.GoogleLoginConfig.AuthCodeURL("randomstate")

	c.Status(fiber.StatusSeeOther)
	c.Redirect(url)
	return c.JSON(url)
}




func GoogleCallback(c *fiber.Ctx) error {
	state := c.Query("state")
	if state != "randomstate" {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid state parameter")
	}

	code := c.Query("code")
	googleConfig := config.GoogleConfig()

	token, err := googleConfig.Exchange(context.Background(), code)
	if err != nil {
		log.Printf("Failed to exchange token: %v", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to exchange token")
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		log.Printf("Failed to get user info: %v", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to get user info")
	}
	defer resp.Body.Close()

	userData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read user data: %v", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to read user data")
	}

	log.Printf("Received user data: %s", string(userData))

	var googleUser struct {
		ID            string `json:"id"`
		Email         string `json:"email"`
		VerifiedEmail bool   `json:"verified_email"`
		Name          string `json:"name"`
		GivenName     string `json:"given_name"`
		FamilyName    string `json:"family_name"`
		Picture       string `json:"picture"`
		Locale        string `json:"locale"`
	}

	if err := json.Unmarshal(userData, &googleUser); err != nil {
		log.Printf("Failed to parse user data: %v", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to parse user data")
	}

	db := database.ConnectDB()
	var user models.User
	if err := db.Where("email = ?", googleUser.Email).First(&user).Error; err != nil {
		user = models.User{
			Email: googleUser.Email,
		}
		if err := db.Create(&user).Error; err != nil {
			log.Printf("Failed to create user: %v", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to create user")
		}
	}

	// Generate JWT token
	tokenString, err := middleware.GenerateJWT(user.ID)
	if err != nil {
		log.Printf("Failed to generate token: %v", err)
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to generate token")
	}

	// Set JWT as cookie
	c.Cookie(&fiber.Cookie{
		Name:     "jwt",
		Value:    tokenString,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   true, // Set to true if using HTTPS
		SameSite: "Lax",
	})
    frontendURL := "http://localhost:5173/oauth-callback?token=" + tokenString
    return c.Redirect(frontendURL)
}