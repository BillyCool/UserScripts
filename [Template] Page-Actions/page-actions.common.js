// --- STYLE ---
GM_addStyle(`
    .vm-corner-btns-container {
        position: fixed;
        z-index: 99999;
        display: flex;
        pointer-events: none;
    }
    .vm-corner-btns-container.vertical { flex-direction: column; }
    .vm-corner-btns-container.horizontal { flex-direction: row; }
    .vm-corner-btns-container.top-left    { top: 20px; left: 20px; }
    .vm-corner-btns-container.top-right   { top: 20px; right: 20px; }
    .vm-corner-btns-container.bottom-left { bottom: 20px; left: 20px; }
    .vm-corner-btns-container.bottom-right{ bottom: 20px; right: 20px; }
    .vm-corner-btn {
        margin: 0;
        background: #222;
        color: #fff;
        border: none;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
        pointer-events: auto;
        position: relative;
        outline: none;
        /* Size and font-size will be set inline */
    }
    .vm-corner-btn:not(:last-child) {
        margin-bottom: 12px;
    }
    .vm-corner-btns-container.horizontal .vm-corner-btn:not(:last-child) {
        margin-bottom: 0;
        margin-right: 12px;
    }
    .vm-corner-btn:hover, .vm-corner-btn:focus {
        background: #444;
        transform: scale(1.08);
    }
    .vm-corner-btn-tooltip {
        visibility: hidden;
        opacity: 0;
        background: #333;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        padding: 4px 10px;
        position: absolute;
        z-index: 100000;
        left: 50%;
        bottom: 110%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 14px;
        pointer-events: none;
        transition: opacity 0.2s;
    }
    .vm-corner-btn:hover .vm-corner-btn-tooltip,
    .vm-corner-btn:focus .vm-corner-btn-tooltip {
        visibility: visible;
        opacity: 1;
    }
`);


// --- RENDERING ---
function renderButtons(config) {
    // Remove previous container if exists
    document.querySelectorAll('.vm-corner-btns-container').forEach(e => e.remove());

    const container = document.createElement('div');
    container.className = `vm-corner-btns-container ${config.direction} ${config.position}`;

    config.buttons.forEach((btn) => {
        const button = document.createElement('button');
        button.className = 'vm-corner-btn';
        button.type = 'button';
        button.innerHTML = btn.icon;
        button.title = btn.tooltip;
        button.tabIndex = 0;

        // Set size and font-size inline
        const size = config.size || 48;
        button.style.width = `${size}px`;
        button.style.height = `${size}px`;
        button.style.fontSize = `${Math.round(size * 0.5)}px`;

        // Tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'vm-corner-btn-tooltip';
        tooltip.textContent = btn.tooltip;
        button.appendChild(tooltip);

        button.addEventListener('click', (e) => {
            btn.onClick(e);
            // Remove focus after click to prevent stuck hover/focus state
            button.blur();
        });
        container.appendChild(button);
    });

    // Adjust gap
    const gap = typeof config.gap === 'number' ? config.gap : 12;
    if (config.direction === 'vertical') {
        container.style.rowGap = `${gap}px`;
    } else {
        container.style.columnGap = `${gap}px`;
    }

    document.body.appendChild(container);
}

// Expose the renderButtons function globally
window.renderButtons = renderButtons;