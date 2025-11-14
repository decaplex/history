document.addEventListener('DOMContentLoaded', function() {
            const commentForm = document.getElementById('commentForm');
            const commentsContainer = document.getElementById('commentsContainer');
            const commentsCount = document.getElementById('commentsCount');
            const clearBtn = document.getElementById('clearBtn');
            
            let isFirebaseReady = false;
            
            // Check if Firebase is ready
            const checkFirebaseReady = setInterval(() => {
                if (window.db && window.firestoreFunctions) {
                    isFirebaseReady = true;
                    clearInterval(checkFirebaseReady);
                    initializeApp();
                }
            }, 100);
            
            // Set timeout fallback
            setTimeout(() => {
                if (!isFirebaseReady) {
                    clearInterval(checkFirebaseReady);
                    commentsContainer.innerHTML = '<div class="no-comments">Firebase connection failed. Please refresh the page.</div>';
                    console.error("Firebase initialization timeout");
                }
            }, 5000);
            
            function initializeApp() {
                console.log("Initializing Firebase app...");
                
                // Load comments from Firebase when page loads
                loadCommentsFromFirebase();
                
                // Handle form submission
                commentForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const name = document.getElementById('name').value.trim();
                    const commentText = document.getElementById('comment').value.trim();
                    
                    if (name && commentText) {
                        await addCommentToFirebase(name, commentText);
                        commentForm.reset();
                    }
                });
                
                // Clear all comments
                clearBtn.addEventListener('click', function() {
                    if (confirm('Thao tác này sẽ xoá hết tất cả bình luận. Bạn có chắc muốn thực hiện?')) {
                        clearAllComments();
                    }
                });
            }
            
            // Add a new comment to Firebase
            async function addCommentToFirebase(name, text) {
                try {
                    const commentData = {
                        name: name,
                        text: text,
                        timestamp: window.firestoreFunctions.serverTimestamp(),
                        date: new Date().toLocaleString()
                    };
                    
                    await window.firestoreFunctions.addDoc(
                        window.firestoreFunctions.collection(window.db, "comments"), 
                        commentData
                    );
                    
                    console.log("Bình luận thêm thành công!");
                } catch (error) {
                    console.error("Error adding comment: ", error);
                    alert("Error posting comment. Please try again.");
                }
            }
            
            // Load and display comments from Firebase
            function loadCommentsFromFirebase() {
                try {
                    const q = window.firestoreFunctions.query(
                        window.firestoreFunctions.collection(window.db, "comments"), 
                        window.firestoreFunctions.orderBy("timestamp", "desc")
                    );
                    
                    window.firestoreFunctions.onSnapshot(q, (querySnapshot) => {
                        const comments = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            comments.push({
                                id: doc.id,
                                name: data.name || "Anonymous",
                                text: data.text,
                                date: data.date || "Recently"
                            });
                        });
                        
                        displayComments(comments);
                    }, (error) => {
                        console.error("Lỗi tải bình luận: ", error);
                        commentsContainer.innerHTML = '<div class="no-comments">Error loading comments. Please check Firebase configuration.</div>';
                    });
                } catch (error) {
                    console.error("Error setting up Firestore listener: ", error);
                    commentsContainer.innerHTML = '<div class="no-comments">Firebase configuration error. Please check the console.</div>';
                }
            }
            
            // Display comments in the UI
            function displayComments(comments) {
                if (comments.length === 0) {
                    commentsContainer.innerHTML = '<div class="no-comments">Hiện chưa có bình luận nào cả. Hãy là người đầu tiên viết cảm nhận!</div>';
                    commentsCount.textContent = 'Bình luận (0)';
                    return;
                }
                
                commentsCount.textContent = `Bình luận (${comments.length})`;
                
                commentsContainer.innerHTML = comments.map(comment => `
                    <div class="comment" data-id="${comment.id}">
                        <div class="comment-header">
                            <div class="comment-author">${escapeHtml(comment.name)}</div>
                            <div class="comment-date">${comment.date}</div>
                        </div>
                        <div class="comment-text">${escapeHtml(comment.text)}</div>
                    </div>
                `).join('');
            }
            
            // Clear all comments from Firebase
            async function clearAllComments() {
                try {
                    const querySnapshot = await window.firestoreFunctions.getDocs(
                        window.firestoreFunctions.collection(window.db, "comments")
                    );
                    
                    const deletePromises = [];
                    querySnapshot.forEach((document) => {
                        deletePromises.push(
                            window.firestoreFunctions.deleteDoc(
                                window.firestoreFunctions.doc(window.db, "comments", document.id)
                            )
                        );
                    });
                    
                    await Promise.all(deletePromises);
                    console.log("Tất cả bài cảm nhận đã được xoá thành công.");
                } catch (error) {
                    console.error("Error deleting comments: ", error);
                    alert("Error deleting comments. Please try again.");
                }
            }
            
            // Helper function to prevent XSS
            function escapeHtml(unsafe) {
                return unsafe
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
        });

