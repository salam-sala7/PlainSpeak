export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0/month",
      description: "Basic access for individuals getting started.",
      features: [
        "Up to 3 projects",
        "Standard translation / plain-speak tools",
        "Community support",
      ],
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$15/month",
      description: "Advanced features for power users and freelancers.",
      features: [
        "Unlimited projects",
        "Priority processing",
        "Custom tone & style presets",
        "Email support",
      ],
      buttonText: "Upgrade to Pro",
    },
    {
      name: "Organization",
      price: "$49/month",
      description: "Collaboration and management tools for teams.",
      features: [
        "Everything in Pro",
        "Shared team workspaces",
        "Role-based permissions",
        "Dedicated account manager",
      ],
      buttonText: "Contact Sales",
    },
  ];

  return (
    <main>
      <header>
        <h1>Subscription Plans</h1>
        <p>Choose the plan that fits your needs.</p>
      </header>

      <section>
        {plans.map((plan) => (
          <article key={plan.name}>
            <h2>{plan.name}</h2>
            <p>
              <strong>{plan.price}</strong>
            </p>
            <p>{plan.description}</p>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <button type="button" onClick={() => console.log(`Selected ${plan.name}`)}>
              {plan.buttonText}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}