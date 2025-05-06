document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle functionality
  const menuToggle = document.querySelector(".menu-toggle")
  const menuModal = document.querySelector(".menu-modal")
  const closeMenuBtn = document.querySelector(".close-menu")

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active")
    menuModal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  })

  closeMenuBtn.addEventListener("click", () => {
    menuModal.classList.remove("active")
    menuToggle.classList.remove("active")
    document.body.style.overflow = "" // Re-enable scrolling
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Header scroll effect
  const header = document.querySelector(".main-header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Stacked Card Carousel functionality
  const cards = document.querySelectorAll(".card-item")
  const dots = document.querySelectorAll(".carousel-dot")
  let currentIndex = 0
  const totalCards = cards.length

  // Initialize carousel
  updateCarousel()

  // Update carousel state
  function updateCarousel() {
    cards.forEach((card, index) => {
      card.classList.remove("active", "prev", "next")

      if (index === currentIndex) {
        card.classList.add("active")
      } else if (index === getPrevIndex()) {
        card.classList.add("prev")
      } else if (index === getNextIndex()) {
        card.classList.add("next")
      }
    })

    // Update active dot
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex)
    })
  }

  // Get previous card index
  function getPrevIndex() {
    return (currentIndex - 1 + totalCards) % totalCards
  }

  // Get next card index
  function getNextIndex() {
    return (currentIndex + 1) % totalCards
  }

  // Go to next card
  function nextCard() {
    currentIndex = getNextIndex()
    updateCarousel()
  }

  // Go to previous card
  function prevCard() {
    currentIndex = getPrevIndex()
    updateCarousel()
  }

  // Go to specific card
  function goToCard(index) {
    currentIndex = index
    updateCarousel()
  }

  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToCard(index)
    })
  })

  // Event listeners for cards (click on prev/next cards)
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const index = Number.parseInt(this.getAttribute("data-index"))
      if (index !== currentIndex) {
        goToCard(index)
      }
    })
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevCard()
    } else if (e.key === "ArrowRight") {
      nextCard()
    } else if (e.key === "Escape") {
      // Close modal on ESC key
      if (menuModal.classList.contains("active")) {
        menuModal.classList.remove("active")
        menuToggle.classList.remove("active")
        document.body.style.overflow = ""
      }
    }
  })

  // Touch events for mobile swipe
  let touchStartX = 0
  let touchEndX = 0
  const carousel = document.querySelector(".card-carousel")

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX
    },
    { passive: true },
  )

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    },
    { passive: true },
  )

  function handleSwipe() {
    const swipeThreshold = 50
    if (touchEndX < touchStartX - swipeThreshold) {
      nextCard() // Swipe left
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevCard() // Swipe right
    }
  }

  // Auto rotate (optional)
  let autoRotate = setInterval(nextCard, 5000)

  // Pause auto rotation on hover
  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoRotate)
  })

  carousel.addEventListener("mouseleave", () => {
    autoRotate = setInterval(nextCard, 5000)
  })
})
