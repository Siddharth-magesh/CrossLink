# **Flutter Frontend Documentation**

## **1. Project Overview**

This is a **modularized Flutter frontend** designed for scalability and maintainability. It follows the **MVC (Model-View-Controller)** pattern, keeping UI and business logic separate.

---

## **2. Directory Structure**

The project is organized inside the `lib/` folder as follows:

```
lib/
│-- main.dart
│-- Components/
│   │-- home/
│   │   │-- home.dart
│   │   │-- home_view.dart
│   │   │-- home_controller.dart
│   │-- profile/
│   │   │-- profile.dart
│   │-- settings/
│   │   │-- settings.dart
```

---

## **3. Installation & Setup**

### **Step 1: Install Flutter SDK**

Download and install Flutter from the official site:  
🔗 [Flutter Install Guide](https://flutter.dev/docs/get-started/install)

Verify installation:

```bash
flutter doctor
```

---

### **Step 2: Clone the Repository**

```bash
git clone https://github.com/Siddharth-magesh/CrossLink.git
cd CrossLink
```

---

### **Step 3: Install Dependencies**

```bash
flutter pub get
```

---

### **Step 4: Run the App**

- **Using Emulator:**

  1. Open **Android Studio** and start an emulator.
  2. Run:
     ```bash
     flutter run
     ```

- **Using Physical Device:**
  1. Enable Developer Mode and USB Debugging on your phone.
  2. Connect your phone via USB and run:
     ```bash
     flutter run
     ```

---

## **4. Modularization Explanation**

Each module inside `Components/` follows the **MVC pattern**:

| File                   | Purpose                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `home.dart`            | Entry point of the Home module, imports view and controller |
| `home_view.dart`       | UI layer (Stateless/StatefulWidget)                         |
| `home_controller.dart` | Business logic, manages state, API calls, etc.              |

## **5. Adding New Pages**

To add a new page, follow these steps:

1. Create a new folder inside `Components/` (e.g., `dashboard/`).
2. Inside `dashboard/`, create:
   - `dashboard.dart`
   - `dashboard_view.dart`
   - `dashboard_controller.dart`
3. Import it in `main.dart`:
   ```dart
   import 'Components/dashboard/dashboard.dart';
   ```

---

## **6. Dependencies Used**

- `flutter`: Core framework
- `provider`: State management
- `http`: API requests (if needed)

Install new dependencies:

```bash
flutter pub add provider http
```

---

## **7. Build APK**

To generate an APK:

```bash
flutter build apk
```

---
