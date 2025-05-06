import fs from "fs"
import path from "path"

// Path to our email storage file
const emailsFilePath = path.join(process.cwd(), "data", "waiting-list-emails.json")

// Ensure the data directory exists
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  fs.mkdirSync(dirname, { recursive: true })
}

// Get existing emails
const getEmails = () => {
  if (!fs.existsSync(emailsFilePath)) {
    ensureDirectoryExists(emailsFilePath)
    fs.writeFileSync(emailsFilePath, JSON.stringify([]))
    return []
  }

  const fileContent = fs.readFileSync(emailsFilePath, "utf8")
  return JSON.parse(fileContent)
}

// Save emails to file
const saveEmails = (emails) => {
  ensureDirectoryExists(emailsFilePath)
  fs.writeFileSync(emailsFilePath, JSON.stringify(emails, null, 2))
}

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { email } = req.body

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" })
    }

    // Get existing emails
    const emails = getEmails()

    // Check if email already exists
    if (emails.includes(email)) {
      return res.status(200).json({
        message: "You are already on our waiting list!",
        alreadyExists: true,
      })
    }

    // Add new email
    emails.push(email)

    // Save updated emails list
    saveEmails(emails)

    // Return success response
    return res.status(200).json({
      message: "Email added to waiting list successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error saving email:", error)
    return res.status(500).json({
      message: "An error occurred while saving your email",
      error: error.message,
    })
  }
}
