 
    // Gym Membership Form Validation
    document.getElementById("membershipForm").addEventListener("submit", function(event) {
      event.preventDefault();

      const memberName = document.getElementById("memberName").value.trim();
      const memberEmail = document.getElementById("memberEmail").value.trim();
      const memberPhone = document.getElementById("memberPhone").value.trim();
      const membershipType = document.getElementById("membershipType").value;
      const fitnessGoals = document.getElementById("fitnessGoals").value.trim();
      const msgEl = document.getElementById("gymFormMsg");

      // Clear previous messages
      msgEl.className = "";
      msgEl.textContent = "";

      if (!memberName || !memberEmail || !memberPhone || !membershipType || !fitnessGoals) {
        msgEl.textContent = "💥 All fields are required to join our gym family!";
        msgEl.className = "error";
        return;
      }

      if (memberName.length < 2) {
        msgEl.textContent = "💥 Please enter your full name (at least 2 characters).";
        msgEl.className = "error";
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(memberEmail)) {
        msgEl.textContent = "💥 Please enter a valid email address for your membership.";
        msgEl.className = "error";
        return;
      }

      const phonePattern = /^[\d\s\-\(\)\.+]{10,}$/;
      if (!phonePattern.test(memberPhone)) {
        msgEl.textContent = "💥 Please enter a valid phone number (at least 10 digits).";
        msgEl.className = "error";
        return;
      }

      if (fitnessGoals.length < 10) {
        msgEl.textContent = "💥 Please tell us more about your fitness goals (at least 10 characters).";
        msgEl.className = "error";
        return;
      }

      msgEl.textContent = "🎉 Welcome to our gym family! Your membership application has been submitted successfully!";
      msgEl.className = "success";
      this.reset();
    });

    // Dynamic Exercise Gallery
    let exerciseCount = 0;

    function updateGalleryEmptyState() {
      const gallery = document.getElementById("exerciseGallery");
      const emptyState = gallery.querySelector(".gallery-empty");
      const hasExercises = gallery.querySelectorAll(".exercise-card").length > 0;

      if (emptyState) {
        emptyState.style.display = hasExercises ? "none" : "block";
      }
    }

    function addExercise() {
      const exerciseName = document.getElementById("exerciseName");
      const exerciseImage = document.getElementById("exerciseImage");
      const nameValue = exerciseName.value.trim();
      const imageFile = exerciseImage.files[0];
      const gallery = document.getElementById("exerciseGallery");

      // Validation: Exercise name is required
      if (!nameValue) {
        exerciseName.focus();
        exerciseName.style.borderColor = "#e74c3c";
        setTimeout(() => {
          exerciseName.style.borderColor = "#e0e0e0";
        }, 3000);
        return;
      }

      if (nameValue.length > 50) {
        alert("💪 Exercise name is too long! Please keep it under 50 characters.");
        return;
      }

      // Validate image file if provided
      if (imageFile && !imageFile.type.startsWith('image/')) {
        exerciseImage.focus();
        exerciseImage.style.borderColor = "#e74c3c";
        alert("🖼️ Please select a valid image file (jpg, png, gif, etc.)");
        setTimeout(() => {
          exerciseImage.style.borderColor = "#e0e0e0";
        }, 3000);
        return;
      }

      exerciseCount++;
      const card = document.createElement("div");
      card.className = "exercise-card";
      
      // Create image container
      const imageContainer = document.createElement("div");
      imageContainer.className = "exercise-image";
      
      if (imageFile) {
        const img = document.createElement("img");
        const reader = new FileReader();
        
        reader.onload = function(e) {
          img.src = e.target.result;
          img.alt = nameValue;
          img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          `;
          imageContainer.appendChild(img);
        };
        
        reader.onerror = function() {
          console.log("❌ Image failed to load, showing placeholder");
          imageContainer.innerHTML = '<div class="image-placeholder">🏋️</div>';
        };
        
        reader.readAsDataURL(imageFile);
      } else {
        imageContainer.innerHTML = '<div class="image-placeholder">🏋️</div>';
      }

      // Create remove button
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-exercise";
      removeBtn.innerHTML = "×";
      removeBtn.title = "Remove exercise";
      removeBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        card.style.animation = "cardSlideOut 0.4s ease";
        setTimeout(() => {
          card.remove();
          updateGalleryEmptyState();
        }, 400);
      });

      // Create info section
      const infoDiv = document.createElement("div");
      infoDiv.className = "exercise-info";
      
      const counter = document.createElement("div");
      counter.className = "exercise-counter";
      counter.textContent = `Exercise #${exerciseCount}`;
      
      const name = document.createElement("div");
      name.className = "exercise-name";
      name.textContent = nameValue;

      // If file was provided, show filename as additional info
      if (imageFile) {
        const fileInfo = document.createElement("div");
        fileInfo.style.cssText = `
          font-size: 0.7rem;
          color: #666;
          margin-top: 5px;
          opacity: 0.8;
          font-style: italic;
        `;
        fileInfo.textContent = `📁 ${imageFile.name}`;
        infoDiv.appendChild(fileInfo);
      }

      infoDiv.appendChild(counter);
      infoDiv.appendChild(name);

      // Add click interaction for the card
      card.addEventListener("click", function() {
        const currentBorder = card.style.borderColor;
        if (currentBorder === "rgb(46, 204, 113)") {
          card.style.borderColor = "transparent";
          card.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
        } else {
          card.style.borderColor = "#2ecc71";
          card.style.boxShadow = "0 15px 35px rgba(46, 204, 113, 0.3)";
        }
      });

      // Assemble the card
      card.appendChild(imageContainer);
      card.appendChild(removeBtn);
      card.appendChild(infoDiv);
      
      gallery.appendChild(card);
      
      // Success feedback
      const addBtn = document.getElementById("addExerciseBtn");
      const originalText = addBtn.textContent;
      addBtn.textContent = "✅ Added!";
      addBtn.style.background = "linear-gradient(45deg, #27ae60, #2ecc71)";
      
      setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.style.background = "linear-gradient(45deg, #2ecc71, #27ae60)";
      }, 1500);
      
      // Clear inputs and preview
      exerciseName.value = "";
      exerciseImage.value = "";
      hideImagePreview();
      
      updateGalleryEmptyState();
      
      console.log(`🏋️ Added exercise: "${nameValue}"${imageFile ? ` with image: ${imageFile.name}` : ''}`);
    }

    function isValidImageUrl(url) {
      try {
        const urlObj = new URL(url);
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname) || 
               /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.search);
      } catch {
        return false;
      }
    }

    // Image preview functionality
    function showImagePreview(file) {
      const preview = document.getElementById("imagePreview");
      const previewImage = document.getElementById("previewImage");
      const previewFilename = document.getElementById("previewFilename");
      
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          previewFilename.textContent = file.name;
          preview.style.display = "block";
          preview.style.animation = "slideDown 0.3s ease";
        };
        reader.readAsDataURL(file);
      } else {
        hideImagePreview();
      }
    }

    function hideImagePreview() {
      const preview = document.getElementById("imagePreview");
      preview.style.display = "none";
    }