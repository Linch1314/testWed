document.addEventListener('DOMContentLoaded', function() {
    // --- 0. Helper function to escape HTML ---
    // ... (代码无变化) ...
    function escapeHTML(str) {
        var p = document.createElement("p");
        if (str === null || str === undefined) return "";
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }
    // --- Helper function to scroll to top ---
    // ... (代码无变化) ...
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    }

    // --- 1. Active navigation link highlighting (Runs on all pages) ---
    // ... (代码无变化) ...
    let currentLocation = window.location.pathname.split("/").pop();
    if (currentLocation === '' || currentLocation === 'legal-ease-website-style2') { 
        currentLocation = 'index.html';
    }
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- 2. Index Page Specific Functionality ---
    // ... (代码无变化) ...
    if (document.getElementById('hero-banner')) { 
      // ... (index page code)
        const modal = document.getElementById('info-modal');
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeModalBtn = modal ? modal.querySelector('.close-btn') : null;

        if (openModalBtn && modal) {
            openModalBtn.onclick = function() {
                modal.style.display = "block";
            }
        }
        if (closeModalBtn && modal) {
            closeModalBtn.onclick = function() {
                modal.style.display = "none";
            }
        }
        if (modal) {
            window.addEventListener('click', function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            });
        }
        const featureItems = document.querySelectorAll('#core-features .feature-item');
        const descriptionArea = document.getElementById('feature-description-area');
        const descriptionTextElement = document.getElementById('feature-description-text');

        const featureDescriptions = {
            "qa": "我们的AI法律问答系统利用先进的自然语言处理技术，能够理解您的法律疑问并提供基于大量法律文献和案例的即时、准确的初步解答。无论是合同条款、劳动纠纷还是知识产权问题，都能为您提供有价值的参考信息。",
            "generator": "告别繁琐的合同撰写！自动合同生成器通过引导式提问，收集您的具体需求，智能匹配最合适的条款，快速生成专业、规范的法律合同。涵盖租赁、雇佣、保密等多种常用合同类型，为您节省时间和成本。",
            "reminders": "法律法规时常更新，合规风险不容忽视。我们的合规提醒服务会根据您的业务类型和关注领域，主动推送最新的法律法规变更、重要的截止日期和合规要求，帮助您及时调整经营策略，避免不必要的法律风险。"
        };
        let currentActiveFeature = null;

        if (featureItems.length > 0 && descriptionArea && descriptionTextElement) {
            featureItems.forEach(item => {
                item.addEventListener('click', function() {
                    const featureKey = this.dataset.feature;
                    if (currentActiveFeature && currentActiveFeature !== this) {
                        currentActiveFeature.classList.remove('active-feature');
                    }
                    if (currentActiveFeature === this) {
                        descriptionArea.classList.add('feature-description-hidden');
                        this.classList.remove('active-feature');
                        currentActiveFeature = null;
                    } else {
                        descriptionTextElement.textContent = featureDescriptions[featureKey] || "描述内容正在准备中...";
                        descriptionArea.classList.remove('feature-description-hidden');
                        this.classList.add('active-feature');
                        currentActiveFeature = this;
                    }
                });
            });
        }
    }


    // --- 3. QA Page Specific Functionality ---
    // ... (代码无变化) ...
    const qaForm = document.getElementById('qa-form');
    if (qaForm) { 
      // ... (qa page code)
        const submitQuestionBtn = document.getElementById('submit-question-btn');
        const legalQuestionInput = document.getElementById('legal-question');
        const aiResponseBubble = document.getElementById('ai-response-bubble');
        const aiResponseTextElement = document.getElementById('ai-response-text');

        qaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const userQuestion = legalQuestionInput.value.trim();

            if (userQuestion === "") {
                aiResponseTextElement.innerHTML = "<em>请输入您的问题后再提交。</em>";
                aiResponseBubble.classList.remove('loading-response');
                return;
            }

            aiResponseTextElement.innerHTML = `<em>AI正在分析您的问题：“${escapeHTML(userQuestion)}”</em>`;
            aiResponseBubble.classList.add('loading-response');

            setTimeout(function() {
                aiResponseBubble.classList.remove('loading-response');
                let aiGeneratedResponse = "";
                const uqLower = userQuestion.toLowerCase();

                if (uqLower.includes("试用期") && (uqLower.includes("解雇") || uqLower.includes("辞退"))) {
                    aiGeneratedResponse = `<strong>AI助手：</strong>针对您关于“${escapeHTML(userQuestion)}”的问题，根据《中华人民共和国劳动合同法》第三十九条及第二十一条规定，在试用期间，用人单位证明劳动者不符合录用条件的，可以解除劳动合同，无需支付经济补偿。但用人单位需提供相应证据。若非因不符合录用条件，则需按正常程序处理。具体情况建议咨询专业律师或查阅相关司法解释。`;
                } else if (uqLower.includes("合同") && uqLower.includes("签订")) {
                    aiGeneratedResponse = `<strong>AI助手：</strong>关于“${escapeHTML(userQuestion)}”，签订合同时务必仔细阅读所有条款，特别是关于权利义务、违约责任、争议解决等部分。不明确之处应及时提出并要求解释。对于重要合同，建议寻求法律专业人士的审阅。LegalEase也提供多种标准合同模板供您参考。`;
                } else if (uqLower.includes("租房") || uqLower.includes("租赁")) {
                    aiGeneratedResponse = `<strong>AI助手：</strong>您提到了“${escapeHTML(userQuestion)}”。在房屋租赁过程中，请注意核实房东身份和房屋产权证明，明确租金、押金、租期、维修责任等条款。签订书面租赁合同非常重要。如果您需要租赁合同模板，可以在我们的模板库中查找。`;
                } else {
                    aiGeneratedResponse = `<strong>AI助手：</strong>关于您提出的“${escapeHTML(userQuestion)}”，这是一个比较具体的问题。通常情况下，我们建议您详细描述您的情况以便获得更精确的初步建议。或者，您可以查阅相关法律法规，或使用我们的专业咨询服务。您也可以尝试我们的<a href="templates.html">合同模板库</a>寻找相关文档。`;
                }
                aiResponseTextElement.innerHTML = aiGeneratedResponse;
                if (aiResponseBubble.scrollIntoView) {
                    aiResponseBubble.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 1500 + Math.random() * 1000);
        });
    }

    // --- 4. Templates Page Specific Functionality ---
    // ... (代码无变化) ...
    const templatesPageContainer = document.getElementById('template-categories'); 
    if (templatesPageContainer) { 
      // ... (templates page code)
        const searchInput = document.getElementById('search-templates-input');
        const searchButton = document.getElementById('search-templates-btn');
        const categoryLinks = document.querySelectorAll('.category-link');
        const templateCards = document.querySelectorAll('.template-card');
        
        const fillTemplateArea = document.getElementById('template-fill-area');
        const fillAreaTitleSpan = document.getElementById('filling-template-name');
        const fillFormContainer = document.getElementById('fill-form-container');
        const submitFilledBtn = document.getElementById('submit-filled-template-btn');
        const cancelFillBtn = document.getElementById('cancel-fill-template-btn');
        
        const successModal = document.getElementById('success-modal');
        const successModalCloseBtns = document.querySelectorAll('.success-modal-close');

        function filterTemplates() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
            const activeCategoryLink = document.querySelector('#template-categories .category-link.active');
            const activeCategory = activeCategoryLink ? activeCategoryLink.dataset.category.toLowerCase() : "all";

            templateCards.forEach(card => {
                const title = card.querySelector('.template-title').textContent.toLowerCase();
                const cardCategory = card.dataset.category ? card.dataset.category.toLowerCase() : "";

                const matchesSearch = title.includes(searchTerm);
                const matchesCategory = (activeCategory === "all" || cardCategory === activeCategory);

                if (matchesSearch && matchesCategory) {
                    card.classList.remove('hidden-card');
                } else {
                    card.classList.add('hidden-card');
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', filterTemplates); 
        }
        if (searchButton) {
            searchButton.addEventListener('click', function(e){
                e.preventDefault(); 
                filterTemplates();
            });
        }

        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                categoryLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                filterTemplates();
                if (fillTemplateArea && !fillTemplateArea.classList.contains('template-fill-area-hidden')) {
                    hideFillArea();
                }
            });
        });
        
        filterTemplates();

        function generateFormFields(templateName) {
            let fieldsHTML = '';
            const tplLower = templateName.toLowerCase();
            if (tplLower.includes('雇佣') || tplLower.includes('劳动合同')) {
                fieldsHTML = `
                    <div class="form-group"><label for="field-employee-name">员工姓名:</label><input type="text" id="field-employee-name" name="employeeName" placeholder="请输入员工全名" required></div>
                    <div class="form-group"><label for="field-position">职位:</label><input type="text" id="field-position" name="position" placeholder="请输入员工职位"></div>
                    <div class="form-group"><label for="field-salary">薪资 (元/月):</label><input type="number" id="field-salary" name="salary" placeholder="例如: 8000"></div>
                    <div class="form-group"><label for="field-startDate">合同开始日期:</label><input type="date" id="field-startDate" name="startDate"></div>`;
            } else if (tplLower.includes('租赁')) {
                fieldsHTML = `
                    <div class="form-group"><label for="field-tenant-name">承租方姓名/名称:</label><input type="text" id="field-tenant-name" name="tenantName" placeholder="请输入承租方信息" required></div>
                    <div class="form-group"><label for="field-property-address">租赁物业地址:</label><input type="text" id="field-property-address" name="propertyAddress" placeholder="请输入详细地址"></div>
                    <div class="form-group"><label for="field-rent-amount">月租金 (元):</label><input type="number" id="field-rent-amount" name="rentAmount" placeholder="例如: 3000"></div>
                    <div class="form-group"><label for="field-lease-term">租赁期限 (月):</label><input type="number" id="field-lease-term" name="leaseTerm" placeholder="例如: 12"></div>`;
            } else if (tplLower.includes('保密协议') || tplLower.includes('nda')) {
                 fieldsHTML = `
                    <div class="form-group"><label for="field-disclosing-party">披露方:</label><input type="text" id="field-disclosing-party" name="disclosingParty" placeholder="请输入信息披露方名称" required></div>
                    <div class="form-group"><label for="field-receiving-party">接收方:</label><input type="text" id="field-receiving-party" name="receivingParty" placeholder="请输入信息接收方名称" required></div>
                    <div class="form-group"><label for="field-confidential-info">保密信息描述:</label><textarea id="field-confidential-info" name="confidentialInfo" rows="3" placeholder="简要描述保密信息的范围和内容"></textarea></div>`;
            } else { 
                fieldsHTML = `
                    <div class="form-group"><label for="field-party-a">甲方:</label><input type="text" id="field-party-a" name="partyA" placeholder="请输入甲方名称/姓名"></div>
                    <div class="form-group"><label for="field-party-b">乙方:</label><input type="text" id="field-party-b" name="partyB" placeholder="请输入乙方名称/姓名"></div>
                    <div class="form-group"><label for="field-details">主要条款/备注:</label><textarea id="field-details" name="details" rows="4" placeholder="请填写合同主要内容或备注信息"></textarea></div>`;
            }
            return fieldsHTML;
        }

        function showFillArea(templateName) {
            if (!fillAreaTitleSpan || !fillFormContainer || !fillTemplateArea) return;
            fillAreaTitleSpan.textContent = templateName;
            fillFormContainer.innerHTML = generateFormFields(templateName);
            fillTemplateArea.classList.remove('template-fill-area-hidden');
        }

        function hideFillArea() {
            if (fillTemplateArea) {
                fillTemplateArea.classList.add('template-fill-area-hidden');
            }
            if (fillFormContainer) fillFormContainer.innerHTML = ''; 
        }


        templateCards.forEach(card => {
            const fillBtn = card.querySelector('.fill-template-btn');
            if (fillBtn) {
                fillBtn.addEventListener('click', function() {
                    const templateName = card.querySelector('.template-title').textContent;
                    showFillArea(templateName);
                    if (fillTemplateArea.scrollIntoView) {
                        fillTemplateArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
            }
        });

        if (cancelFillBtn) {
            cancelFillBtn.addEventListener('click', function(e) {
                e.preventDefault();
                hideFillArea();
            });
        }

        if (submitFilledBtn) {
            submitFilledBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const requiredInputs = fillFormContainer.querySelectorAll('input[required], textarea[required]');
                let allValid = true;
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        allValid = false;
                        input.style.borderColor = 'red';
                        input.addEventListener('input', () => { input.style.borderColor = '#ccc'; }, { once: true });
                    } else {
                        input.style.borderColor = '#ccc';
                    }
                });

                if (!allValid) {
                    alert('请填写所有必填项！');
                    return;
                }
                
                console.log("--- Template Data for: " + (fillAreaTitleSpan ? fillAreaTitleSpan.textContent : 'Unknown Template') + " ---");
                const inputs = fillFormContainer.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    if (input.name && input.id) {
                         console.log(`${input.labels && input.labels.length > 0 ? input.labels[0].textContent : input.name}: ${input.value}`);
                    }
                });
                console.log("--- End of Template Data ---");

                hideFillArea();

                if (successModal) {
                    successModal.style.display = "block";
                } else {
                    alert('模板填写成功！(信息已在控制台打印)');
                    scrollToTop(); 
                }
            });
        }

        if (successModal) {
            successModalCloseBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    successModal.style.display = "none";
                    scrollToTop(); 
                });
            });
            window.addEventListener('click', function(event) {
                if (event.target == successModal) {
                    successModal.style.display = "none";
                    scrollToTop(); 
                }
            });
        }
    }


    // --- 5. How It Works & Pricing Page Specific Functionality ---
    const pricingPageIndicator = document.getElementById('pricing'); // Element unique to this page
    if (pricingPageIndicator) {
        const freeStartBtn = document.getElementById('free-start-btn');
        const selectPremiumBtn = document.getElementById('select-premium-btn');
        const notificationModal = document.getElementById('notification-modal');
        const notificationIconEl = document.getElementById('notification-modal-icon');
        const notificationTitleEl = document.getElementById('notification-modal-title');
        const notificationMessageEl = document.getElementById('notification-modal-message');
        const notificationActionsEl = document.getElementById('notification-modal-actions');
        const notificationModalCloseBtns = document.querySelectorAll('.notification-modal-close');

        // Function to show generic notification modal
        function showNotification(iconClass, title, message, actionsHTML = '<button class="button-style notification-modal-close">[知道了]</button>') {
            if (!notificationModal || !notificationIconEl || !notificationTitleEl || !notificationMessageEl || !notificationActionsEl) return;
            
            notificationIconEl.innerHTML = `<i class="fas ${iconClass}"></i>`;
            notificationTitleEl.textContent = title;
            notificationMessageEl.innerHTML = message; // Use innerHTML if message contains HTML
            notificationActionsEl.innerHTML = actionsHTML;
            
            // Re-attach event listeners for dynamically added close buttons within actions
            const dynamicCloseBtns = notificationActionsEl.querySelectorAll('.notification-modal-close');
            dynamicCloseBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    notificationModal.style.display = "none";
                    scrollToTop(); // Scroll to top after closing any notification
                });
            });
            
            notificationModal.style.display = "block";
        }

        // Close notification modal
        if (notificationModal) {
            notificationModalCloseBtns.forEach(btn => { // Handles pre-existing close button
                btn.addEventListener('click', () => {
                    notificationModal.style.display = "none";
                    scrollToTop();
                });
            });
            window.addEventListener('click', (event) => {
                if (event.target == notificationModal) {
                    notificationModal.style.display = "none";
                    scrollToTop();
                }
            });
        }

        // "Free Start" button click
        if (freeStartBtn) {
            freeStartBtn.addEventListener('click', function() {
                showNotification('fa-check-circle success-icon', '操作成功', '您的免费体验已成功开启！祝您使用愉快。');
            });
        }

        // "Select Premium" button click
        if (selectPremiumBtn) {
            selectPremiumBtn.addEventListener('click', function() {
                const premiumPlanPrice = "¥400.00"; // Or get dynamically
                const actions = `
                    <button id="confirm-recharge-btn" class="button-style confirm-btn">[确认充值]</button>
                    <button class="button-style cancel-btn notification-modal-close">[取消]</button>
                `;
                showNotification(
                    'fa-credit-card info-icon', 
                    '服务升级确认', 
                    `您将为 LegalEase 高级服务套餐充值 <strong>${premiumPlanPrice}</strong>。<br>请确认是否继续？`,
                    actions
                );

                // Add event listener for the dynamically created confirm button
                const confirmRechargeBtn = document.getElementById('confirm-recharge-btn');
                if (confirmRechargeBtn) {
                    confirmRechargeBtn.addEventListener('click', function() {
                        // Simulate recharge success
                        setTimeout(() => { // Small delay to feel like a process
                            showNotification(
                                'fa-star success-icon',
                                '充值成功',
                                '恭喜！您的 LegalEase 高级服务已成功开启。所有高级功能均已解锁。'
                            );
                        }, 500);
                    });
                }
            });
        }
        
        // Add hover effects for steps and pricing cards are handled by CSS :hover pseudo-class.
        // If more complex JS-based hover is needed, it would go here.

    } // End of How It Works & Pricing Page Specific Functionality

    console.log("LegalEase Universal Scripts Loaded!");
});