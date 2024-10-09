package main

import (
	"log"

	"github.com/Omramanuj/bookApp/server/config"
	"github.com/Omramanuj/bookApp/server/controllers"
	"github.com/Omramanuj/bookApp/server/database"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf("error loading .env file: %v\n", err)
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173", 
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))
	db := database.ConnectDB()

	database.Migrate(db)

	config.GoogleConfig()

	app.Get("/google_login", controllers.GoogleLogin)
	app.Get("/google_callback", controllers.GoogleCallback)
	app.Post("/login", controllers.LoginOrRegister)
	app.Get("/user", controllers.GetUser)
	app.Post("/logout", controllers.Logout)
	log.Fatal(app.Listen(":8080"))
}
