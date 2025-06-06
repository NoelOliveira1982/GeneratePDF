import { IInputs } from "../generated/ManifestTypes";

export const appearanceMap: Record<string, string> = {
  primary: "accent",
  secondary: "neutral",
  outline: "outline",
  subtle: "stealth",
  transparent: "stealth"
};

export function getFluentAppearance(powerAppsType: string): string {
  return appearanceMap[powerAppsType.toLowerCase()] || "accent";
}

export function updateButtonProperties(button: HTMLElement, provider: HTMLElement, parameters: IInputs): void {
  const appearance = parameters.buttonAppearance.raw?.toLowerCase() || "primary";
  button.setAttribute("appearance", appearanceMap[appearance] || "accent");
  button.textContent = parameters.buttonText.raw || "Gerar PDF";

  if (parameters.color.raw) {
    provider.style.setProperty("--accent-fill-rest", parameters.color.raw);
    //provider.style.setProperty("--accent-foreground-rest", getContrastColor(parameters.color.raw));
  }
}

export function updateProviderDimensions(provider: HTMLElement, parameters: IInputs): void {
  // Aplica as dimensões ao provider (container do Fluent)
  if (parameters.width.raw) {
    provider.style.width = parameters.width.raw;
  }

  if (parameters.height.raw) {
    provider.style.height = parameters.height.raw;
  }
}