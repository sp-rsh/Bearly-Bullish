exports.id=519,exports.ids=[519],exports.modules={9563:(e,t,a)=>{Promise.resolve().then(a.bind(a,5302)),Promise.resolve().then(a.t.bind(a,9404,23))},428:(e,t,a)=>{Promise.resolve().then(a.t.bind(a,2994,23)),Promise.resolve().then(a.t.bind(a,6114,23)),Promise.resolve().then(a.t.bind(a,9727,23)),Promise.resolve().then(a.t.bind(a,9671,23)),Promise.resolve().then(a.t.bind(a,1868,23)),Promise.resolve().then(a.t.bind(a,4759,23))},5302:(e,t,a)=>{"use strict";a.d(t,{Header:()=>c});var n=a(326),i=a(434),r=a(5047),s=a(7577);let o=[["Markets","/markets"],["Learn","/learn"],["Research","/research"],["Businesses","/businesses"],["Fin \xd7 Tech","/fin-tech"]];function c(){let[e,t]=(0,s.useState)(!1),a=(0,r.usePathname)();return(0,n.jsxs)("header",{className:"border-b border-slate-200 bg-paper",children:[(0,n.jsxs)("div",{className:"mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6",children:[(0,n.jsxs)(i.default,{href:"/",className:"focus-ring font-editorial text-2xl font-bold tracking-tight",children:["finetra",n.jsx("span",{className:"text-brand",children:"."})]}),(0,n.jsxs)("nav",{className:"hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex",children:[o.map(([e,t])=>n.jsx(i.default,{className:`focus-ring hover:text-ink ${a===t?"text-brand":" "}`,href:t,children:e},t)),n.jsx(i.default,{className:"focus-ring border-l border-slate-200 pl-6 text-ink hover:text-brand",href:"/search",children:"Search"})]}),n.jsx("button",{className:"focus-ring border border-slate-300 px-3 py-2 text-sm md:hidden",onClick:()=>t(!e),"aria-expanded":e,children:"Menu"})]}),e&&n.jsx("nav",{className:"border-t border-slate-200 px-4 py-3 md:hidden",children:[...o,["Search","/search"]].map(([e,a])=>n.jsx(i.default,{href:a,onClick:()=>t(!1),className:"block py-2 text-sm font-medium",children:e},a))})]})}},1223:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>c,metadata:()=>o});var n=a(9510);a(7272);let i=(0,a(8570).createProxy)(String.raw`C:\Users\Sparsh\OneDrive\Desktop\Finetra\components\header.tsx#Header`);var r=a(7371);function s(){return n.jsx("footer",{className:"mt-20 border-t border-slate-200 bg-white",children:(0,n.jsxs)("div",{className:"mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6",children:[(0,n.jsxs)("p",{children:[n.jsx("span",{className:"font-editorial text-lg font-bold text-ink",children:"finetra."})," Independent finance, business and technology."]}),(0,n.jsxs)("div",{className:"flex gap-5",children:[n.jsx(r.default,{href:"/about",children:"About"}),n.jsx(r.default,{href:"/search",children:"Search"}),n.jsx("a",{href:"https://www.investopedia.com/dictionary/",target:"_blank",rel:"noreferrer",children:"Investopedia"})]})]})})}let o={title:{default:"Finetra — Markets, business & technology",template:"%s | Finetra"},description:"Independent reporting and explainers on markets, business, finance and technology.",metadataBase:new URL("https://finetra.example"),openGraph:{title:"Finetra",description:"Markets, business, finance and technology."}};function c({children:e}){return n.jsx("html",{lang:"en",children:(0,n.jsxs)("body",{children:[n.jsx(i,{}),e,n.jsx(s,{})]})})}},3530:(e,t,a)=>{"use strict";a.d(t,{T:()=>c,q:()=>o});var n=a(9510),i=a(7371),r=a(1019);let s={Markets:"bg-emerald-50 text-emerald-800",Learn:"bg-blue-50 text-blue-800",Research:"bg-violet-50 text-violet-800",Businesses:"bg-amber-50 text-amber-800","Fin \xd7 Tech":"bg-slate-200 text-slate-800"};function o({category:e}){return n.jsx(i.default,{href:`/${(0,r.$)(e)}`,className:`focus-ring inline-block px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${s[e]}`,children:e})}function c({article:e,large:t=!1}){return(0,n.jsxs)("article",{className:`border-t border-slate-300 py-5 ${t?"sm:py-8":""}`,children:[n.jsx(o,{category:e.category}),(0,n.jsxs)(i.default,{href:`/article/${e.slug}`,className:"focus-ring group mt-3 block",children:[n.jsx("h3",{className:`font-editorial font-bold tracking-tight group-hover:text-brand ${t?"text-3xl leading-tight sm:text-4xl":"text-xl leading-snug"}`,children:e.title}),n.jsx("p",{className:"mt-2 max-w-xl text-sm leading-6 text-slate-600",children:e.excerpt}),n.jsx("p",{className:"mt-3 text-xs font-medium text-slate-500",children:e.readingTime})]})]})}},1019:(e,t,a)=>{"use strict";a.d(t,{$:()=>o,Dq:()=>r,fq:()=>s});let n=e=>e.split("\n\n"),i=e=>[`This publication entry covers ${e}.`,"The supplied editorial source material for this topic is maintained as part of the publication library. This page is structured for its full text, related reading and future database-backed publishing."],r=[{slug:"basic-vocabulary",title:"BASIC VOCABULARY",category:"Learn",tag:"Finance Basics",excerpt:"The very basic terms you need to know to get started.",body:[],readingTime:"Reference",featured:!0},{slug:"ai-earnings-call-research",title:"AI Earnings Call Research",category:"Research",tag:"Fin \xd7 Tech",excerpt:"A research framework for reading AI signals in earnings calls.",body:i("AI earnings-call research"),readingTime:"4 min",featured:!0},{slug:"colgate-toothpaste",title:"The Colgate Toothpaste Tube",category:"Businesses",tag:"Strategy",excerpt:"A business lesson hidden in an everyday consumer product.",body:i("the Colgate toothpaste-tube strategy"),readingTime:"3 min",featured:!0},{slug:"ai-humans",title:"AI, Humans and the Work Ahead",category:"Fin \xd7 Tech",tag:"Businesses",excerpt:"Meta, Ford, McDonald’s and Taco Bell show different ways AI meets work.",body:i("AI, people and business strategy across Meta, Ford, McDonald’s and Taco Bell"),readingTime:"4 min",featured:!0},{slug:"trading-comps-vs-precedent-transactions",title:"Trading Comps vs Precedent Transactions",category:"Learn",tag:"Valuation",excerpt:"Two common valuation methods, and the different questions they answer.",body:i("trading comparables and precedent transactions"),readingTime:"4 min",featured:!0},{slug:"uber-driver-engagement",title:"Uber Driver Engagement",category:"Businesses",tag:"Strategy",excerpt:"How a platform thinks about driver engagement.",body:i("Uber’s driver-engagement model"),readingTime:"3 min",featured:!0},{slug:"depreciation-three-financial-statements",title:"Depreciation and the Three Financial Statements",category:"Learn",tag:"Corporate Finance",excerpt:"A $10 increase in depreciation does not reduce net income by the full $10.",body:n(`What is the effect of increasing depreciation by $10 on the three financial statements?

Most people answered that net income will fall by $10, cash flow from operations will increase by $10, and total assets will fall by $10.

But that's not the complete answer.

What we need to understand is that depreciation is a non-cash and tax-deductible expense.

Your profit before tax will fall by $10. But assuming a 30% tax rate, your tax expense will decrease by $3.

This means the impact on net income is just a $7 decrease.

In the cash flow statement, net income starts $7 lower, and there will be an increase in depreciation of $10.

This means the net cash flow from operations will increase by $3.

On the balance sheet, PP&E will fall by $10, cash will increase by $3, and the net effect on retained earnings will be a $7 decrease.

That's the final answer most people look for.`),readingTime:"2 min",featured:!0},{slug:"samsung-expectations",title:"Samsung: Expectations vs Reality",category:"Markets",tag:"Businesses",excerpt:"Why market expectations can matter as much as the result itself.",body:i("Samsung and the gap between expectations and reality"),readingTime:"3 min",featured:!0},{slug:"big-mac-index",title:"The Big Mac Index",category:"Learn",tag:"Economics",excerpt:"A burger price can make purchasing power parity easier to understand.",body:n(`Did you know that the price of a burger can tell you more about the economy than the internet exchange rate?

In 1986, the concept of the Big Mac Index was introduced by The Economist, which compares the prices of a Big Mac across different countries.

You might get jealous of your friend who earns $100,000 in the US, which is roughly around ₹95,00,000 in India, while you are stuck here earning ₹38,00,000 per annum.

But that's where things get interesting.

The price of a Big Mac in the US is $6.22, while in India it's just ₹236, which is around $2.46.

This means that with $6 in hand, I can buy one burger in the US and roughly 2.5 burgers in India.

And by making some simple calculations, we can see that earning ₹38,00,000 in India can give us roughly the same standard of living as earning $100,000 in the US — and, of course, ceteris paribus.

Just to clarify, the Big Mac Index is simply an informal index created by The Economist to make purchasing power parity (PPP) easier to understand and estimate. It's not a precise measure of someone's actual standard of living.

Let me know your thoughts on this.`),readingTime:"2 min"},{slug:"shrinkflation",title:"Shrinkflation: The Price You Do Not See",category:"Learn",tag:"Economics",excerpt:"Pears reduced from 60g to 57g while the ₹20 price tag stayed intact.",body:n(`A soap you've been getting for ₹20 for the past 10 years might not be the same size anymore.

That's exactly what happened with Pears from HUL, where the quantity of the soap was reduced from 60g to 57g while the price tag of ₹20 remained intact.

This is a prime example of a concept known as shrinkflation.

Now imagine if the price had increased directly from ₹20 to ₹22. That visible increase in price would have had a higher impact on demand compared to simply reducing the quantity.

And that's where the psychological impact of shrinkflation comes in.

A small and unnoticed decrease in quantity creates a psychological impact among consumers — they feel like they're buying the same product for the same price, even though they're actually paying more per gram for the same product.

But companies generally don't use shrinkflation simply to increase their profits. It is mostly used by FMCG companies to protect their margins when production costs rise, without angering consumers with a visible price increase.

So the next time you go to buy a soap, don't just look at the price. Also look at the quantity.

Comment down your thoughts.`),readingTime:"2 min"},{slug:"npv-vs-irr",title:"NPV vs IRR",category:"Learn",tag:"Corporate Finance",excerpt:"The higher return is not always the project that creates the most value.",body:n(`Imagine you have two projects.

Project A gives you a 30% IRR but a $500 NPV, while Project B gives you a 20% IRR and a $1,000 NPV.

Which one would you choose?

If you said Project A, you're wrong.

NPV, or Net Present Value, tells you how much value a project has created after discounting its future cash flows to today's value.

While IRR, or Internal Rate of Return, is the discount rate at which NPV is zero.

So IRR tells you the percentage return, while NPV tells you the actual value created.

This becomes important when you're choosing between two mutually exclusive projects. A smaller project can have a higher IRR but a lower NPV, while a larger project can create significantly more value.

That's why NPV is generally preferred over IRR because the main goal of corporate finance is to maximize shareholder value.

IRR also has a major drawback: it assumes that a project's cash flows are reinvested at the IRR itself, which can be pretty unrealistic.`),readingTime:"2 min"},{slug:"swiggy-iocc",title:"Swiggy, Foreign Ownership and IOCC",category:"Businesses",tag:"Markets",excerpt:"A look at ownership, operating companies and the market.",body:i("Swiggy, foreign ownership and IOCC"),readingTime:"3 min"},{slug:"reverse-dcf",title:"Reverse DCF",category:"Research",tag:"Valuation",excerpt:"Start with the share price and ask what the market must be expecting.",body:i("reverse DCF valuation"),readingTime:"3 min"},{slug:"dividends-buybacks",title:"Dividends and Buybacks",category:"Learn",tag:"Corporate Finance",excerpt:"Two ways companies return capital, and how tax changes the equation.",body:i("dividends, buybacks and taxation"),readingTime:"3 min"},{slug:"situational-awareness",title:"Situational Awareness, Leverage and AI Funds",category:"Markets",tag:"Fin \xd7 Tech",excerpt:"A reminder that context matters when leverage meets a powerful narrative.",body:i("situational awareness, leverage and AI funds"),readingTime:"3 min"},{slug:"sebi-closing-auction",title:"SEBI Closing Auction Session",category:"Markets",tag:"Market Structure",excerpt:"What a closing auction session is designed to do.",body:i("the SEBI closing-auction session"),readingTime:"3 min"},{slug:"synthetic-cdo",title:"Synthetic CDO",category:"Learn",tag:"Finance",excerpt:"A plain-language look at a complex credit-market instrument.",body:i("synthetic CDOs"),readingTime:"4 min"},{slug:"sector-rotation",title:"Sector Rotation",category:"Markets",tag:"Investing",excerpt:"Why market leadership moves as conditions and expectations change.",body:i("sector rotation"),readingTime:"3 min"},{slug:"dcf",title:"DCF in 60 Seconds",category:"Learn",tag:"Valuation",excerpt:"The core intuition behind discounted cash flow valuation.",body:i("DCF valuation"),readingTime:"2 min"}],s=e=>r.find(t=>t.slug===e),o=e=>"Fin \xd7 Tech"===e?"fin-tech":e.toLowerCase()},7272:()=>{}};