"use client"

import { useState } from "react"
import fs from "fs"
import path from "path"

// This is a simple admin page to view collected emails
export default function WaitingListAdmin({ initialEmails }) {
  const [emails, setEmails] = useState(initialEmails)
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState("")

  // Simple authentication (in a real app, use proper authentication)
  const handleLogin = (e) => {
    e.preventDefault()
    // This is just a simple example - in a real app, use proper authentication
    if (password === "diverse2025") {
      // Change this to a secure password
      setAuthenticated(true)
      setError("")
    } else {
      setError("Invalid password")
    }
  }

  // Export emails as CSV
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + emails.join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "waiting-list-emails.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!authenticated) {
    return (
      <div style={{ maxWidth: "500px", margin: "100px auto", padding: "20px", backgroundColor: "#000", color: "#fff" }}>
        <h1 style={{ marginBottom: "20px" }}>Admin Login</h1>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", backgroundColor: "#333", color: "#fff", border: "none" }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: "10px 20px", backgroundColor: "#fff", color: "#000", border: "none", cursor: "pointer" }}
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px", backgroundColor: "#000", color: "#fff" }}>
      <h1 style={{ marginBottom: "20px" }}>Waiting List Emails</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p>Total Emails: {emails.length}</p>
        <button
          onClick={exportCSV}
          style={{ padding: "10px 20px", backgroundColor: "#fff", color: "#000", border: "none", cursor: "pointer" }}
        >
          Export as CSV
        </button>
      </div>
      <div
        style={{ backgroundColor: "#111", padding: "20px", borderRadius: "5px", maxHeight: "500px", overflowY: "auto" }}
      >
        {emails.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {emails.map((email, index) => (
              <li key={index} style={{ padding: "10px", borderBottom: "1px solid #333" }}>
                {email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No emails collected yet.</p>
        )}
      </div>
    </div>
  )
}

// Server-side function to get the emails
export async function getServerSideProps() {
  try {
    const emailsFilePath = path.join(process.cwd(), "data", "waiting-list-emails.json")

    // Check if file exists
    if (!fs.existsSync(emailsFilePath)) {
      return { props: { initialEmails: [] } }
    }

    // Read the file
    const fileContent = fs.readFileSync(emailsFilePath, "utf8")
    const emails = JSON.parse(fileContent)

    return {
      props: {
        initialEmails: emails,
      },
    }
  } catch (error) {
    console.error("Error reading emails file:", error)
    return {
      props: {
        initialEmails: [],
      },
    }
  }
}
