<p align="center">
  <img src="assets/logo.png" alt="Bite Logo" width="200"/>
</p>

# 🍴 Bite - AI-Powered Recipe App

> Snap a photo, get a recipe! Bite uses advanced AI to identify dishes and generate detailed recipes from your food photos.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI/CD](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)]()
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)]()

**A modern, AI-powered recipe application built with React Native and Express.js**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-api-documentation) • [Contributing](#-contributing)

---

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="assets/screenshoots/01.jpg" alt="Home Screen" width="250"/><br/>
        <b>Home Screen</b>
      </td>
      <td align="center">
        <img src="assets/screenshoots/02.jpg" alt="AI Scanner" width="250"/><br/>
        <b>AI Scanner</b>
      </td>
      <td align="center">
        <img src="assets/screenshoots/03.jpg" alt="Recipe Details" width="250"/><br/>
        <b>Recipe Details</b>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="assets/screenshoots/04.jpg" alt="Search" width="250"/><br/>
        <b>Search Recipes</b>
      </td>
      <td align="center">
        <img src="assets/screenshoots/05.jpg" alt="Favorites" width="250"/><br/>
        <b>Favorites</b>
      </td>
      <td align="center">
        <img src="assets/screenshoots/06.jpg" alt="Recipe Generated" width="250"/><br/>
        <b>AI Generated Recipe</b>
      </td>
    </tr>
  </table>
</div>

---

---

## ✨ Features

### 🤖 AI-Powered Recognition
- **Dish Identification**: Instantly identify dishes from photos
- **Recipe Generation**: Generate detailed recipes with ingredients and instructions
- **Smart Analysis**: Powered by Google's advanced Gemini 2.0 Flash AI model
- **High Accuracy**: Get precise dish names and cooking details

### 📱 Mobile Experience
- **Cross-platform**: iOS and Android support with Expo
- **Offline Storage**: Save recipes locally with SQLite
- **Beautiful UI**: Modern, intuitive interface with smooth animations
- **Photo Integration**: Seamless camera and gallery integration
- **Fast & Responsive**: Optimized performance for smooth UX

### 🔍 Discovery & Search
- **Recipe Search**: Find recipes by name, ingredients, or cuisine
- **Category Filtering**: Browse by meal type, cuisine, or difficulty
- **Favorites**: Save and organize your favorite recipes
- **Smart Suggestions**: Get personalized recipe recommendations

### 🔧 Developer Experience
- **TypeScript**: Full type safety across the entire codebase
- **Monorepo**: Organized workspace with pnpm for efficient development
- **Clean Architecture**: Separation of concerns with clean code principles
- **Hot Reload**: Fast development with instant feedback
- **Well-Tested**: Comprehensive test coverage

---

## 🛠️ Tech Stack

**Frontend (Mobile)**

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

**Backend (API)**

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Google AI](https://img.shields.io/badge/Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

**Tools & Infrastructure**

![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

---

### 🎯 Key Architectural Principles

| Principle | Implementation | Benefits |
|-----------|---------------|----------|
| **Separation of Concerns** | Clean layered architecture | Easy maintenance and testing |
| **Type Safety** | TypeScript across entire stack | Catch errors at compile time |
| **Modularity** | Monorepo with workspaces | Independent scaling & deployment |
| **Offline-First** | SQLite local storage | Works without internet |
| **API-Driven** | RESTful API design | Platform-agnostic integration |

---

### 📱 Mobile App Architecture

**Technology Stack:**
- **Framework**: Expo SDK 51 with React Native
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API + Local State
- **Database**: SQLite with Drizzle ORM
- **Styling**: StyleSheet with custom design system
- **AI Integration**: REST API calls to backend
- **Image Handling**: Expo Image Picker & Camera



---

### 🚀 Backend API Architecture

**Technology Stack:**
- **Runtime**: Bun (primary) / Node.js (fallback)
- **Framework**: Express.js with TypeScript
- **AI Engine**: Google Genkit with Gemini 2.0 Flash
- **Validation**: Zod schemas for type-safe validation
- **Error Handling**: Centralized middleware
- **Architecture Pattern**: Clean Architecture


---

### 🤖 AI Processing Flow

The AI processing pipeline handles image analysis and recipe generation:

1. **Image Upload**: Mobile app captures/selects image → converts to Data URI
2. **API Request**: Sends Data URI to backend endpoint
3. **Validation**: Zod schema validates request format
4. **AI Processing**: 
   - Genkit routes request to Gemini 2.0 Flash
   - Image is analyzed for dish identification
   - Recipe is generated with structured output
5. **Response**: Typed response sent back to mobile
6. **Local Storage**: Recipe saved to SQLite for offline access


---

## 🔧 Configuration

### Environment Variables

#### API Configuration (`api/.env`)
```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# AI Service
GOOGLE_GENAI_API_KEY=your_google_ai_api_key

# Optional: Logging
LOG_LEVEL=info
```

#### Mobile Configuration
```bash
# Expo configuration is in app.json
# API endpoint is configured in mobile/constants/api.ts
```


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
