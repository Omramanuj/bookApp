package main

import (
	"log"

	"github.com/Omramanuj/bookApp/server/config"
	"github.com/Omramanuj/bookApp/server/controllers"
	"github.com/Omramanuj/bookApp/server/database"
	"github.com/Omramanuj/bookApp/server/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf("error loading .env file: %v\n", err)
	}

	app := fiber.New(fiber.Config{
		BodyLimit: 100*1024*1024,
	})
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		ExposeHeaders:    "Upgrade",
	}))


	db := database.ConnectDB()

	database.Migrate(db)

	config.GoogleConfig()
	middleware.InitAWS()

	app.Get("/google_login", controllers.GoogleLogin)
	app.Get("/google_callback", controllers.GoogleCallback)
	app.Post("/login", controllers.LoginOrRegister)
	app.Get("/user", controllers.GetUser)
	app.Post("/logout", controllers.Logout)
	app.Post("/book_url",controllers.GetBookURL)
	app.Post("/save_book",controllers.SaveBook)
	app.Get("/books",controllers.GetBooks)
	app.Put("/books/:id/progress", controllers.UpdateProgress)


	log.Fatal(app.Listen(":8080"))
}
