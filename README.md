# 🚀 Bootstrap Break-even Planner

**Know when you're free to quit your job.**  
A clean, minimalist tool that helps indie hackers, freelancers, and side-hustlers calculate their financial freedom and estimate when their side income can sustain them.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ceasermikes004s-projects/v0-bootstrap-break-even-planner)  

---

## 📍 Live Demo

👉 **[Try the tool live →](https://bbe-planner.vercel.app/)**  
_(No login. Free. Instant results.)_

---

## 📘 Overview

**Bootstrap Break-even Planner** is a free, simple, and visual tool that helps you determine:

- How much money you need monthly to break even
- How close you are to being financially independent from your job
- How long until you reach freedom, based on your income growth rate

Whether you're a:
- Side project builder
- Indie SaaS founder
- Freelancer planning to quit Upwork
- Student or developer tired of the 9–5

...this tool gives you clarity and peace of mind.

---

## 🎯 Features

- 🧾 **Expense Tracker**: Enter your monthly expenses (rent, food, subscriptions, etc.)
- 💰 **Income Sources**: Add income from MRR, freelancing, passive revenue
- 🎯 **Freedom Score**: See what % of your expenses are currently covered
- 📈 **Growth Projection**: Estimate when you can quit, based on monthly income growth
- 📊 **Clean Visuals**: Progress bars, charts, and freedom meters
- 📤 **Share Your Score** (Coming soon): Shareable image for Twitter/X and social media
- 💾 **No Account Needed**: Your data stays on your browser using localStorage

---

## 🧠 Behind the Logic

**Financial Freedom % =**  
`(Current Monthly Income ÷ Total Monthly Expenses) × 100`

**Growth Projection:**
\`\`\`ts
n = log(freedomNumber / currentIncome) / log(1 + monthlyGrowthRate)
\`\`\``

Where `n` is the number of months it will take to reach break-even.

---

## 🧑‍💻 Tech Stack

| Tool                                             | Purpose                             |
| ------------------------------------------------ | ----------------------------------- |
| [Next.js](https://nextjs.org/)                   | App framework                       |
| [Tailwind CSS](https://tailwindcss.com/)         | Styling                             |
| [Recharts.js](https://recharts.org/)             | Graphing projections                |
| [Vercel](https://vercel.com)                     | Deployment platform                 |
| LocalStorage                                     | Data persistence (client-side only) |

---

## 📦 Installation (If cloning manually)

\`\`\`bash
git clone https://github.com/ceasermikes002/bootstrap-break-even-planner.git
cd bootstrap-break-even-planner
npm install
npm run dev
\`\`\`

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 📐 Future Improvements

* [ ] Improve PDF export of results
* [ ] Save multiple income/expense profiles
* [ ] Notifications/reminders for growth milestones

---

## 🛠 Contributing

Contributions are welcome! Here’s how you can help:

1. Fork this repo
2. Create a new branch (`git checkout -b feature/thing`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to your branch (`git push origin feature/thing`)
5. Submit a Pull Request

---

## 🧑‍🎓 Credits

Created by [Chima](https://chima-portfolio.vercel.app)

---

## 📫 Contact

For feedback, ideas, or questions, reach out at:
📧 **[chimaemekamicheal@gmail.com](mailto:chimaemekamicheal@gmail.com)**

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
