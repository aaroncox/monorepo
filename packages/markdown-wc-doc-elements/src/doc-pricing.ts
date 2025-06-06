import { LitElement, css, html } from "lit"

export default class Element extends LitElement {
	static override styles = css`
		.doc-dev-tool {
			background-color: #ffffff;
			padding: 1rem 2rem;
			border-radius: 1rem;
			border: 1px solid #e2e8f0;
		}
		.doc-h2 {
		}
		.doc-p {
			color: #475569;
			line-height: 1.6rem;
		}
	`

	static override properties = {
		heading: { type: String },
		content: { type: String },
	}

	heading: string =
		"Individual and small scale usage stays free. Future enterprise features might cost money."

	content: string = `We have little incentive to monetize individual or small scale usage but we do plan to make money. Monetization will come from larger companies. Hence, we see individual usage as marketing. Users who love this app will recommend it to their larger employers/companies that we can monetize.`

	override render() {
		return html`<div class="doc-dev-tool">
			<h2 class="doc-h2">${this.heading}</h2>
			<p class="doc-p">${this.content}</p>
		</div> `
	}
}

if (typeof customElements !== "undefined" && !customElements.get("doc-pricing")) {
	customElements.define("doc-pricing", Element)
}
