document.addEventListener("DOMContentLoaded", () => {
    // Initialize editors
    const editors = {
      html: ace.edit("html-editor"),
      css: ace.edit("css-editor"),
      js: ace.edit("js-editor"),
    }
  
    // Editor configuration
    const editorConfig = {
      html: {
        mode: "ace/mode/html",
        content:
          "<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Welcome to Codify!</h1>\n    <p>Start coding here...</p>\n</body>\n</html>",
      },
      css: {
        mode: "ace/mode/css",
        content:
          "body {\n    font-family: Arial, sans-serif;\n}\n\nh1 {\n    color: #3a86ff;\n    text-align: center;\n}\n\np {\n    font-size: 1.2rem;\n    line-height: 1.6;\n        color: green;}",
      },
      js: {
        mode: "ace/mode/javascript",
        content:
          "// Your JavaScript code here\nconsole.log('Happy coding!');\n\nfunction greet() {\n    alert('Hello, World!');\n}",
      },
    }
  
    // Configure each editor
    Object.entries(editors).forEach(([key, editor]) => {
      const config = editorConfig[key]
      editor.setTheme("ace/theme/monokai")
      editor.session.setMode(config.mode)
      editor.setValue(config.content, -1) // -1 moves cursor to start
      editor.setOptions({
        fontSize: "14px",
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showPrintMargin: false,
        tabSize: 4,
        useSoftTabs: true,
        showGutter: true,
        highlightActiveLine: true,
      })
    })
  
    // UI Elements
    const themeToggle = document.getElementById("theme-toggle")
    const runBtn = document.getElementById("run-btn")
    const openNewPageBtn = document.getElementById("open-new-page-btn")
    const saveBtn = document.getElementById("save-btn")
    const outputContent = document.getElementById("output-content")
    const loadingOverlay = document.getElementById("loading-overlay")
  
    // Theme toggle handling
    let isDarkMode = true
    function toggleTheme() {
      isDarkMode = !isDarkMode
      document.body.classList.toggle("dark-mode")
      const theme = isDarkMode ? "ace/theme/monokai" : "ace/theme/solarized_light"
      themeToggle.innerHTML = `<i class="fas fa-${isDarkMode ? "sun" : "moon"}"></i>`
  
      Object.values(editors).forEach((editor) => {
        editor.setTheme(theme)
      })
    }
  
    // Generate HTML content
    function generateHTMLContent() {
      const htmlCode = editors.html.getValue()
      const cssCode = editors.css.getValue()
      const jsCode = editors.js.getValue()
  
      return `
              <html>
                  <head>
                      <style>${cssCode}</style>
                  </head>
                  <body>
                      ${htmlCode}
                      <script>${jsCode}</script>
                  </body>
              </html>
          `
    }
  
    // Run code and display output
    async function runCode() {
      loadingOverlay.classList.remove("hidden")
      outputContent.style.opacity = "0"
  
      // Simulate a delay for the loading effect
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      const content = generateHTMLContent()
      outputContent.innerHTML = ""
      const iframe = document.createElement("iframe")
      iframe.style.width = "100%"
      iframe.style.height = "100%"
      iframe.style.border = "none"
      outputContent.appendChild(iframe)
  
      iframe.contentWindow.document.open()
      iframe.contentWindow.document.write(content)
      iframe.contentWindow.document.close()
  
      loadingOverlay.classList.add("hidden")
      outputContent.style.opacity = "1"
      outputContent.style.transition = "opacity 0.5s ease"
    }
  
    // Open result in new page
    function openInNewPage() {
      const content = generateHTMLContent()
      const newWindow = window.open()
      newWindow.document.write(content)
      newWindow.document.close()
    }
  
    // Save button click handler
    function handleSave() {
      const content = generateHTMLContent()
      const blob = new Blob([content], { type: "text/html;charset=utf-8" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = "code_notebook_pro_project.html"
      link.click()
      URL.revokeObjectURL(link.href)
    }
  
    // Minimize/Maximize functionality
    function toggleMinimize(element) {
      element.classList.toggle("minimized")
      element.classList.remove("maximized")
    }
  
    function toggleMaximize(element) {
      element.classList.toggle("maximized")
      element.classList.remove("minimized")
    }
  
    // Add smooth scrolling animation
    function smoothScroll(target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  
    // Event Listeners
    themeToggle.addEventListener("click", toggleTheme)
    runBtn.addEventListener("click", handleRun)
    openNewPageBtn.addEventListener("click", openInNewPage)
    saveBtn.addEventListener("click", handleSave)
  
    document.querySelectorAll(".minimize-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const wrapper = e.target.closest(".editor-wrapper") || e.target.closest(".output-container")
        toggleMinimize(wrapper)
      })
    })
  
    document.querySelectorAll(".maximize-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const wrapper = e.target.closest(".editor-wrapper") || e.target.closest(".output-container")
        toggleMaximize(wrapper)
      })
    })
  
    // Add smooth scrolling to the run button
    runBtn.addEventListener("click", () => {
      smoothScroll(document.querySelector(".output-container"))
    })
  
    // Run button click handler
    async function handleRun() {
      loadingOverlay.classList.remove("hidden")
      try {
        runCode()
      } catch (error) {
        outputContent.textContent = `Error: ${error.message}`
      } finally {
        loadingOverlay.classList.add("hidden")
      }
    }
  
    // Initialize UI
    toggleTheme() // Set initial theme
    runCode() // Initial run to show default output
  })
  
  