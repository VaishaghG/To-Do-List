    const plusIcon = document.getElementById('plus-icon')
    const page = document.getElementById('page')
    const list = document.getElementById('list')
    const colorkey = document.getElementById('color-switch')
    let inputBox =null

    plusIcon.addEventListener("click", function(e) {
        if (!inputBox) {
            inputBox = document.createElement("input");
            inputBox.type = "text";
            inputBox.placeholder = "Enter task...";
            inputBox.className = "task-input";
            page.appendChild(inputBox);
            inputBox.focus();

            inputBox.addEventListener("keydown", function(e) {
                if (e.key === "Enter" && inputBox.value.trim() !== "") {
                    const taskText = inputBox.value.trim();

                    const itemContainer = document.createElement("div");
                    itemContainer.className = "list-item";

                    const taskLabel = document.createElement("span");
                    taskLabel.textContent = taskText;

                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";

                    list.appendChild(itemContainer);
                    itemContainer.appendChild(taskLabel);
                    itemContainer.appendChild(checkbox);

                    inputBox.remove();
                    inputBox = null;
                }
            });
        }
    });

        document.addEventListener("click", function(e) {
        if (inputBox && !e.target.classList.contains("task-input") && e.target !== plusIcon) {
            inputBox.remove();
            inputBox = null;
        }
    }); 

    const colors =['#FFD1DC','#D0F0C0','#B3E5FC','#E1BEE7','#f7efaf']
    let index=0;
    colorkey.addEventListener("click", function(e){
        page.style.backgroundColor= colors[index];
        plusIcon.style.color= colors[index];
        index=(index+1) % colors.length;
    });
