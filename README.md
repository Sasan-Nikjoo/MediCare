# 🩺 Dr. Nikjoo Pharmacy - Pharmacy Management App

Welcome to the **Pharmacy Management App** for **Dr. Nikjoo Pharmacy**!  
This professional, user-friendly mobile application is designed to streamline patient prescription management for pharmacies. Built with **React Native** and **Expo**, it offers a modern, responsive interface with a consistent design, enabling pharmacists to efficiently manage patient records, search by national ID, and perform CRUD operations.

---

## 🚀 Features

### 🔍 Search by National ID
- Quickly filter patient prescriptions using the Iranian national ID.

### 📋 Prescription Management
- ➕ **Add**: Create new prescriptions with fields for national ID, patient name, prescription details, and price.
- 👁️ **View**: Display detailed prescription information, including timestamp.
- ✏️ **Edit**: Update existing prescriptions with pre-filled forms.
- 🗑️ **Delete**: Remove prescriptions with confirmation alerts.

### 🎨 Professional UI
- **Unified color scheme**:
  - 🔵 Blue `#007bff` for branding
  - 🟢 Green `#28a745` for edit/save
  - 🔴 Red `#dc3545` for delete
- **Consistent typography**:
  - 🏷️ Bold headers (24pt), labels (16pt), and values (15pt)
- **Modern cards**:
  - 🧾 Rounded corners, subtle shadows, blue left borders
- **Branded header**:
  - 🏥 "Dr. Nikjoo Pharmacy" on the main screen

### 📱 Responsive Design
- Optimized for Android and iOS using React Native

### 💾 Persistent Storage
- Saves prescriptions to AsyncStorage for data persistence

### 🧭 Seamless Navigation
- Powered by `expo-router` for smooth transitions between screens

---

## 🛠️ Tech Stack

- ⚛️ **React Native**: Cross-platform mobile app framework
- 📦 **Expo**: Simplifies development and deployment
- 🗂️ **expo-router**: File-based navigation for routing
- 🧠 **AsyncStorage**: Local storage for persisting prescription data
- 🆔 **UUID**: Generates unique IDs for prescriptions
- 🖼️ **Material Icons**: For intuitive button icons
- 🧑‍💻 **TypeScript**: Ensures type safety and maintainability

---

## 🧰 Frameworks & Languages Used

### 💻 Programming Languages
- 🟦 **TypeScript** – for type-safe application logic
- 🟨 **JavaScript** – used within React Native and configuration files
- 📄 **JSON** – for configuration, data storage, and metadata
- 🎨 **CSS-in-JS** – styling components within React Native (`StyleSheet` API)

### 🧱 Frameworks & Libraries
- ⚛️ **React Native** – for building cross-platform mobile apps
- 🌐 **Node.js** – runtime environment for development tools
- 📦 **Expo** – simplifies React Native development
- 🧭 **expo-router** – file-based routing system
- 💽 **AsyncStorage** – local device storage
- 🆔 **UUID** – for generating unique prescription IDs
- 🧩 **@expo/vector-icons** – for consistent and scalable icons

---

## 📂 Project Structure

```
pharmacy-app/
├── app/
│   ├── Index.tsx           # Main screen with search and prescription list
│   ├── prescription-details.tsx  # Displays detailed prescription info
│   ├── add-prescription.tsx      # Form for adding/editing prescriptions
│   ├── _layout.tsx         # Navigation stack configuration
├── App.tsx                 # App entry point
├── package.json            # Dependencies and scripts
├── README.md               # Project documentation
```

---

## 📦 Installation

### 🔧 Prerequisites
- 📥 Node.js (v16 or higher)
- 📦 npm or yarn
- 🌐 Expo CLI: Install globally with `npm install -g expo-cli`
- 📱 Expo Go: Install on your Android/iOS device for testing

### 🚀 Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/pharmacy-app.git
   cd pharmacy-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

   Required dependencies:
   - react-native
   - expo
   - expo-router
   - @react-native-async-storage/async-storage
   - react-native-get-random-values
   - uuid
   - @expo/vector-icons
   - @react-navigation/stack

3. **Start the Expo Server**
   ```bash
   npx expo start
   ```

   - 📷 Scan the QR code with the Expo Go app or run in an emulator.

4. **Clear Cache (if needed)**
   ```bash
   npx expo start --clear
   ```

---

## 🖥️ Usage

### 🏠 Main Screen (`Index.tsx`)
- 🏥 Branded header: **Dr. Nikjoo Pharmacy**
- 🔍 Search bar to filter prescriptions by national ID
- 📄 Tap a prescription card to view details or press 🗑️ to delete
- ➕ Press to add a new prescription

### 📄 Prescription Details (`prescription-details.tsx`)
- Shows: 🆔 National ID, 👤 Patient Name, 💊 Prescription, 💰 Price, 🕒 Timestamp
- ✏️ Edit button navigates to the edit form
- 🔙 Back button returns to the main screen

### ✍️ Add/Edit Prescription (`add-prescription.tsx`)
- Fields: 🆔 National ID, 👤 Name, 💊 Prescription Details, 💰 Price
- 💾 Save button stores data
- 🔙 Back button cancels and returns

---

## 🎨 Design Details

### 🖌️ Color Palette
- 🔵 **Primary**: `#007bff` (headers/buttons)
- 🟢 **Success**: `#28a745` (edit/save)
- 🔴 **Danger**: `#dc3545` (delete)
- ⚪ **Background**: `#f8f9fa` (light gray)
- 🗂️ **Cards/Inputs**: `#ffffff`, `#f1f3f5`
- 🔤 **Text**:
  - Labels: `#343a40`
  - Values: `#495057`
  - Placeholders: `#6c757d`

### 🔡 Typography
- 🏷️ Headers: `fontSize: 24`, `fontWeight: 700`
- 📋 Card Labels: `fontSize: 16`, `fontWeight: 600`
- 📝 Card Values: `fontSize: 15`
- 🔘 Button Text: `fontSize: 16`, `fontWeight: 500`
- 🏥 Brand Header: `fontSize: 28`, `fontWeight: 700`

### 🧩 Components
- 🧾 **Cards**: `borderRadius: 12`, `shadowOpacity: 0.15`, `elevation: 3`, blue left border
- 🔘 **Buttons**: `borderRadius: 8`, `padding: 10x15`, icons (`24px`)
- ✏️ **Inputs**: `height: 48`, `borderRadius: 12`, `backgroundColor: #f1f3f5`
- 📱 **Navigation Header**: Blue background, white text, `fontSize: 20`, `fontWeight: 700`

---

## 🐛 Troubleshooting

- 🚧 **Navigation Issues**: Ensure file names match routes in `_layout.tsx`
- 🎨 **Styling Not Updating**: Clear cache using `npx expo start --clear`
- 🧱 **Dependency Errors**: Reinstall with `npm install` and verify `package.json`
- 📲 **Device Testing**: Use Expo Go or emulator. Ensure same network as dev server

---

## 🌟 Contributing

1. 🍴 Fork the repository  
2. 🛠️ Create a feature branch  
   ```bash
   git checkout -b feature/YourFeature
   ```
3. 💾 Commit your changes  
   ```bash
   git commit -m "Add YourFeature"
   ```
4. 📤 Push to the branch  
   ```bash
   git push origin feature/YourFeature
   ```
5. 📬 Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.  
See the `LICENSE` file for details.

---

## 📬 Contact

For questions or feedback, reach out at **your-email@example.com** or open an issue on GitHub.

> Built with 💙 by **Sasan Nikjoo** for **Dr. Nikjoo Pharmacy**
