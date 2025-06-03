const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
];

export default function ThemeList() {
  return (
    <dialog id="theme_list" className="modal">
      <div className="modal-box duration-75 bg-base-200">
        <div className="font-bold text-lg mb-1">Choose a theme:</div>

        <div className="flex flex-wrap gap-3">
          {themes.map((theme) => (
            <ThemeButton theme={theme} key={theme} />
          ))}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function ThemeButton({ theme }: { theme: string }) {
  return (
    <button
      className="theme-controller inline-flex cursor-pointer"
      data-set-theme={theme}
      value={theme}
      data-theme={theme}
    >
      <div className="bg-primary aspect-square h-5 border-2"></div>
      <div className="bg-secondary aspect-square h-5 border-2"></div>
      <div className="bg-accent aspect-square h-5 border-2"></div>
      <div className="bg-neutral aspect-square h-5 border-2"></div>
    </button>
  );
}
