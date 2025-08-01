import { useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";

function App() {
  const [ theme, setTheme ] = useState('');

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "" : "dark"));
  }

  return (
    <div className={`${theme ? "dark" : ""} bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 h-screen w-full`}>
      <header className="sticky top-0 z-50">
        <nav className="mx-auto flex max-w-3xl px-8 py-6 items-center justify-between">
            <ul className="flex gap-8 text-stone-600 dark:text-stone-400">
              <li>Home</li>
              <li>Projects</li>
              <li>Contact</li>
            </ul>
            <button
              onClick={toggleTheme} 
              className="p-3 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg"
          >
            {theme === "dark" ? <LuMoon /> : <LuSun />}
          </button>
        </nav>
      </header>

      <main className="mt-0 max-w-3xl px-8 mx-auto">
        <section className="p-8 flex justify-between gap-12 border-solid border-1 rounded-3xl border-stone-200 dark:border-stone-800">
          <img width="175" height="175" src="https://img.freepik.com/free-photo/classic-portrait-silhouette-man_23-2149707045.jpg?semt=ais_hybrid&w=740&q=80"/>

          <div className="p-4 flex flex-col">
            <h1 className="text-5xl font-bold">Hi, I'm Dylan.</h1>
            <p className="mt-3 text-balance">University Student by day, Full Stack Developer by night.</p>
            <p className="mt-3 text-balance">I develop solutions for startup companies lorem ipsum sit dolor amet</p>
            <div className="flex gap-4 mt-5 text-stone-600 dark:text-stone-400">
              <p>Resume</p>
              <p><LuMoon /></p>
              <p><LuSun/></p>
              <p><LuMoon/></p>
            </div>
          </div>
        </section>
        
        <section className="mt-8">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Experience</h2>
            <div className="flex items-center">
              <span>View More</span>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-8">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Projects</h2>
            <div className="flex items-center">
              <span>View More</span>
            </div>
          </div>
          <div className="flex justify-between gap-8">
            <div className="flex flex-col w-full h-[600px] gap-8">
              <div className="h-full w-full border-solid border-1 rounded-3xl border-stone-200 dark:border-stone-800"></div>
              <div className="h-[300px] w-full border-solid border-1 rounded-3xl border-stone-200 dark:border-stone-800"></div>
            </div>
            <div className="flex flex-col w-full h-[600px] gap-8">
              <div className="h-[300px] w-full border-solid border-1 rounded-3xl border-stone-200 dark:border-stone-800"></div>
              <div className="h-full w-full border-solid border-1 rounded-3xl border-stone-200 dark:border-stone-800"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
