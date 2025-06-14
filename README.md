## 🧑‍🤝‍🧑 Group Organizer

**Group Organizer** is a lightweight Node.js-based web tool that lets an administrator organize people into custom-sized groups, while users can check which group they’re in — or request access if they're not yet assigned.

### ✨ Features

- 🔐 Admin login to control group creation
- 👤 Users check their assigned group by name
- 📝 Unassigned users are logged and visible to admin
- 📂 Data is saved to a local file (`data.json`) for persistence
- 💻 Simple frontend (`admin.html`, `user.html`) served separately

### 🔧 Use Cases

- Classroom group projects
- Workshop or hackathon team assignment
- Random groupings for events or games
- Any place you need to "divide and conquer" a name list!

---

### 📦 Tech Stack

- Node.js + Express
- Vanilla HTML/CSS/JS for frontend
- File-based storage with `fs-extra`
- JWT-based login authentication for admin

---

### 🚀 Getting Started

1. Clone the repo  
   ```bash
git clone https://github.com/sendmetirries/group-organiser
   cd group-organizer

