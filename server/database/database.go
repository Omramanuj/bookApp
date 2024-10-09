package database

import (
	"log"
	"os"

	"github.com/Omramanuj/bookApp/server/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() *gorm.DB {
	connString := os.Getenv("db_conn_string")

	db, err := gorm.Open(postgres.Open(connString), &gorm.Config{})
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	return db
}

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(&models.User{}, &models.Book{})

	if err != nil {
		log.Fatalf("failed to migrate database sche,a: %v \n", err)
	}

	log.Println("Database migration completed successfully.")
}
