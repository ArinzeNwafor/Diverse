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

      // Close waiting list modal on ESC key
      if (waitingListModal.classList.contains("active")) {
        waitingListModal.classList.remove("active")
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

  // Scroll animations using Intersection Observer
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".animate-on-scroll")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated")
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    elements.forEach((element) => {
      observer.observe(element)
    })
  }

  // Parallax effect for hero section
  const parallaxEffect = () => {
    const heroSection = document.querySelector(".hero")

    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset
      if (heroSection) {
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`
      }
    })
  }

  // Animate counter numbers
  const animateCounters = () => {
    const counters = document.querySelectorAll(".counter")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target
            const target = Number.parseInt(counter.getAttribute("data-target"))
            let count = 0
            const updateCounter = () => {
              const increment = target / 100
              if (count < target) {
                count += increment
                counter.innerText = Math.ceil(count)
                setTimeout(updateCounter, 10)
              } else {
                counter.innerText = target
              }
            }
            updateCounter()
            observer.unobserve(counter)
          }
        })
      },
      {
        threshold: 1,
      },
    )

    counters.forEach((counter) => {
      observer.observe(counter)
    })
  }

  // Highlight active nav item based on scroll position
  const highlightNavOnScroll = () => {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link")

    window.addEventListener("scroll", () => {
      let current = ""

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight

        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute("id")
        }
      })

      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active")
        }
      })
    })
  }

  // Initialize all animations
  animateOnScroll()
  parallaxEffect()
  animateCounters()
  highlightNavOnScroll()

  // Add scroll-to-top button functionality
  const scrollToTopBtn = document.querySelector(".scroll-to-top")

  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("show")
      } else {
        scrollToTopBtn.classList.remove("show")
      }
    })

    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Waiting List Modal functionality
  const waitingListModal = document.querySelector(".waiting-list-modal")
  const closeModalBtn = document.querySelector(".close-modal")
  const waitingListForm = document.getElementById("waitingListForm")
  const formMessage = document.querySelector(".form-message")

  // Show modal after 5 seconds
  setTimeout(() => {
    waitingListModal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
  }, 5000)

  // Close modal when clicking the close button
  closeModalBtn.addEventListener("click", () => {
    waitingListModal.classList.remove("active")
    document.body.style.overflow = "" // Re-enable scrolling
  })

  // Close modal when clicking outside the content
  waitingListModal.addEventListener("click", (e) => {
    if (e.target === waitingListModal) {
      waitingListModal.classList.remove("active")
      document.body.style.overflow = "" // Re-enable scrolling
    }
  })

  // Form submission
  waitingListForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const emailInput = document.getElementById("email")
    const email = emailInput.value.trim()

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      formMessage.textContent = "Please enter a valid email address."
      formMessage.className = "form-message error"
      return
    }

    // Simulate form submission (replace with actual API call)
    formMessage.textContent = "Submitting..."
    formMessage.className = "form-message"

    // Simulate API call with timeout
    setTimeout(() => {
      formMessage.textContent = "Thank you! You've been added to our waiting list."
      formMessage.className = "form-message success"
      emailInput.value = ""

      // Close modal after successful submission (optional)
      setTimeout(() => {
        waitingListModal.classList.remove("active")
        document.body.style.overflow = "" // Re-enable scrolling
      }, 3000)
    }, 1500)
  })
})
