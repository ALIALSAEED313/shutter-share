# Shutter Share


## Overview

## Screenshots

## Technologies Used

## Getting Started

## Installation

## User Stories
- As a new visitor, I want to register for a new account with a username and password so that I can participate in the community.
- As a registered user, I want to securely log in and log out so that my portfolio remains protected when I step away from my computer.
- As a photographer, I want a dedicated profile page (/users/:id) that displays only the photos I have uploaded so that I can share a single link to my personal portfolio.
- As a visitor (guest or logged-in), I want to view a main feed of all uploaded photos so that I can discover new art and get inspiration.
- As a photo owner, I want to edit my photo's title or camera settings so that I can fix typos without having to delete and re-upload the entire image.
- As a photo owner, I want to delete my photo so that I can remove older work that no longer represents my current skill level.
- As a logged-in user, I want to write a comment on someone else's photo so that I can offer praise or constructive critique.
- As a comment author, I want to delete my own comment so that I can remove my feedback if I change my mind or posted it on the wrong photo.
- As the system, I want to hide the "Upload," "Edit," and "Delete" buttons from guest users and prevent access to those specific Express routes so that unauthorized users cannot alter the database.

## Database Design



## Routes

| Method | Route | Description |
|---------|-------|-------------|
| GET | /auth/sign-up | New user registration form |
| POST | /auth/sign-up | Create a new user account |
| GET | /auth/sign-in | User login form |
| POST | /auth/sign-in | Authenticate user session |
| GET | /auth/sign-out | End current user session |
| GET | /photos | View main gallery of all photos |
| GET | /photos/new | Upload new photo form |
| POST | /photos | Save new photo to the database |
| GET | /photos/:id | View a single photo and its reviews |
| GET | /photos/:id/edit | Edit photo form |
| PUT | /photos/:id | Update photo details |
| DELETE | /photos/:id | Delete photo and associated reviews |
| POST | /photos/:photoId/reviews | Create a new review for a photo |
| GET | /photos/:photoId/reviews/:reviewId/edit | Edit review form |
| PUT | /photos/:photoId/reviews/:reviewId | Update review text and rating |
| DELETE | /photos/:photoId/reviews/:reviewId | Delete a specific review |


## Features



## Future Enhancements



## Credits