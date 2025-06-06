import { LitElement, html, css } from "lit"

export default class Element extends LitElement {
	static override properties = {
		popupIndex: { type: Number },
		items: { type: String },
		looping: { type: Boolean },
	}

	items: string = ""
	looping: boolean = false
	popupIndex: number = -1

	private _firstIndex: number = 0
	private _offset: number = 0

	override connectedCallback() {
		super.connectedCallback()

		window.addEventListener("resize", this._initiateContainers)
	}

	override disconnectedCallback() {
		super.disconnectedCallback()

		window.removeEventListener("resize", this._initiateContainers)
	}

	static override get styles() {
		return css`
			:host {
				--item-margin: 8px;
				--item-offset: 7px;
				--item-width: 348px;
				display: flex;
				flex-direction: row;
			}

			.btn-next,
			.btn-prev {
				background: none;
				border: 0;
				color: #1e313b;
				cursor: pointer;
				font-size: 36px;
				outline: none;
				background-color: #e2e8f0;
				aspect-ratio: 1 / 1;
				width: 40px;
				max-width: 40px;
				height: auto;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: all 0.2s ease-in-out;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				z-index: 1;
			}

			.btn-next {
				right: -20px;
			}

			.btn-prev {
				left: -20px;
			}

			.btn-next:hover,
			.btn-prev:hover {
				color: #10172a;
				background-color: #cbd5e1;
			}

			.hidden {
				visibility: hidden;
			}

			#contents {
				display: flex;
				flex: 1;
				overflow: hidden;
				position: relative;
			}

			.wrapper {
				position: relative;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				width: calc(100% - 40px);
				margin: 0 auto;
			}

			article {
				box-shadow:
					0 0 0 1px rgba(63, 63, 68, 0.05),
					0 1px 3px 0 rgba(63, 63, 68, 0.15);
				box-sizing: border-box;
				flex-shrink: 0;
				margin: var(--item-margin);
				/* width + left and right margins */
				transform: translateX(calc(-1 * var(--item-offset)));
				transition: transform 300ms;
				width: var(--item-width);
				border-radius: 0.5rem;
				cursor: zoom-in;
			}

			article img {
				object-fit: cover;
				width: 100%;
				height: 100%;
				border-radius: 0.5rem;
			}

			:host([looping]) article {
				transition: none;
			}

			.popup {
				position: fixed;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
				background-color: #00000080;
				z-index: 99;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: zoom-out;
			}

			.popup > img {
				max-width: 1100px;
				width: 90%;
			}
		`
	}

	override render() {
		const itemsArray = this.items.split(",").map((item) => item.trim()) as string[]

		return html`
			<div class="wrapper">
				<button class="btn-prev" @click=${() => this._move("left")}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"
						/>
					</svg>
				</button>
				<div id="contents">
					${itemsArray.map(
						(item: string) => html`
							<article
								@click=${() => {
									this.popupIndex = itemsArray.indexOf(item)
								}}
							>
								<img src="${item}" />
							</article>
						`
					)}
				</div>
				${this.popupIndex !== -1
					? html`<div
							class="popup"
							@click=${() => {
								this.popupIndex = -1
							}}
						>
							<img src="${itemsArray[this.popupIndex]}" />
						</div>`
					: undefined}
				<button class="btn-next" @click=${() => this._move("right")}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
						/>
					</svg>
				</button>
			</div>
		`
	}

	_initiateContainers() {}

	/**
	 * Moves the items to the specified direction.
	 * @param {string} direction The movement direction.
	 */
	_move(direction: string) {
		const itemsArray = this.items.split(",").map((item) => item.trim()) as string[]
		const container = this.shadowRoot?.getElementById("contents")
		const styles = getComputedStyle(this)
		const itemMargin = parseFloat(styles.getPropertyValue("--item-margin"))
		const itemWidth = parseFloat(styles.getPropertyValue("--item-width"))
		const itemTotalWidth = itemWidth + 2 * itemMargin

		if (this.looping) {
			const items = container?.querySelectorAll("article")

			if (!items) {
				return
			}

			const lastIndex = items.length - 1

			if (direction === "left") {
				this._firstIndex = this._firstIndex === 0 ? lastIndex : this._firstIndex - 1
			} else {
				this._firstIndex = this._firstIndex === lastIndex ? 0 : this._firstIndex + 1
			}

			// Move items from this._firstIndex to the lastIndex left.
			for (let i = this._firstIndex; i < items.length; i++) {
				items[i]!.style.transform = `translateX(-${itemTotalWidth * this._firstIndex}px)`
			}

			// Move the rest of the items right.
			for (let i = 0; i < this._firstIndex; i++) {
				items[i]!.style.transform = `translateX(${
					itemTotalWidth * (items.length - this._firstIndex)
				}px)`
			}
		} else {
			const itemsTotalWidth = itemTotalWidth * itemsArray.length
			const buffer = itemsTotalWidth - container!.clientWidth

			if (direction === "left") {
				this._offset = this._offset - itemTotalWidth >= 0 ? this._offset - itemTotalWidth : 0
			} else {
				this._offset =
					this._offset + itemTotalWidth > buffer ? buffer : this._offset + itemTotalWidth
			}
		}

		this.style.setProperty("--item-offset", `${this._offset}px`)

		// TODO automatic re-rendering is not working. manual re-rendering is needed
		this.requestUpdate()
	}
}

if (!customElements.get("doc-slider")) {
	customElements.define("doc-slider", Element)
}
