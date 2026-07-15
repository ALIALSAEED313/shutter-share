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
| GET | / | Home page |
| GET | /listings | List all listings |
| GET | /listings/new | New listing form |
| POST | /listings | Create listing |
| GET | /listings/:id | View listing |
| GET | /listings/:id/edit | Edit listing form |
| PUT | /listings/:id | Update listing |
| DELETE | /listings/:id | Delete listing |



## Features



## Future Enhancements



## Credits