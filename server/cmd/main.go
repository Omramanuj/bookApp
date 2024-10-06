package main

import (
	"github.com/Omramanuj/bookApp/server/config"
	"github.com/Omramanuj/bookApp/server/controllers"
	"github.com/gofiber/fiber/v2"
)

func main(){
	app:=fiber.New()
	
	config.GoogleConfig()
	app.Get("/google_login",controllers.GoogleLogin)
	app.Get("/google_callback",controllers.GoogleCallback)

	app.Listen(":8080")
}