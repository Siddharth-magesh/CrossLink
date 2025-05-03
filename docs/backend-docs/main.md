# **CrossLink Backend Microservice**

This is a **Flask-based microservice** that provides APIs for event management and member retrieval. It uses **MongoDB** for data storage and follows a modular architecture for maintainability and scalability.

---

## **Features**

- **Add Events:** Store event details in MongoDB.
- **Fetch Members:** Retrieve member details with optional filters.
- **Modularized Code:** `EventManager` class handles both event and member operations.

---

## **Installation & Setup**

### **1️⃣ Install Miniconda (Recommended)**

To create an isolated Python environment, install **Miniconda**:

- Download Miniconda from: [https://docs.conda.io/en/latest/miniconda.html](https://docs.conda.io/en/latest/miniconda.html)
- Install and initialize it.

### **2️⃣ Create a Virtual Environment**

Run the following commands:

```bash
conda create --name crosslink-env python=3.10 -y
conda activate crosslink-env
```

### **3️⃣ Clone the Repository**

```bash
git clone - Download Miniconda from: https://github.com/Siddharth-magesh/CrossLink.git
cd CrossLink
```

### **4️⃣ Install Dependencies**

```bash
cd backend
pip install -r requirements.txt
```

### **5️⃣ Set Up Environment Variables**

Create a **`.env`** file in the root directory and add:

```ini
SECRET_KEY=your_secret_key
MONGO_URI="mongodb://localhost:27017/crosslink"
BASE_MAIL_ADDRESS='emailid@gmail.com'
MAIL_SERVER='smtp.gmail.com'
MAIL_PORT=587
MAIL_USERNAME='emailid@gmail.com'
MAIL_PASSWORD='password'
MAIL_USE_TLS=True
MAIL_USE_SSL=False
```

### **6️⃣ Run the Flask App**

```bash
python app.py
```

The API will be available at: **`http://127.0.0.1:5000`**

---

## **Directory Structure**

```
/crosslink-backend
│── app.py                 # Main Flask app
│── .env                   # Environment variables
│── requirements.txt        # Dependencies
│── /utils
│   │── __init__.py         # Package initializer
│   │── event_manager.py    # Manages events & members
│── README.md               # Documentation
```
