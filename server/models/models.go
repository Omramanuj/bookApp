package models

import (
	"time"
)

type User struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Email         string    `gorm:"unique;not null" json:"email"`
	Username      string    `json:"username"`
	Password      string    `json:"password,omitempty"` // For normal login
	OauthProvider string    `json:"oauth_provider"`
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`
	Books         []Book    `json:"books,omitempty"` // One-to-many relation
}

type Book struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Title         string    `json:"title"`
	Author        string    `json:"author"`
	PublishedDate time.Time `json:"published_date"`
	ISBN          string    `json:"isbn"`
	UserID        uint      `json:"user_id" gorm:"index"` // Foreign key
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`
}
