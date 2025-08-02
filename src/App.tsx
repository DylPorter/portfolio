import { useState } from "react";
import { LuSun, LuMoon } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope } from "react-icons/fa6";

function App() {
  const [ theme, setTheme ] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className={`${theme === "dark" ? "dark" : ""} bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen w-full pb-16`}>
      <header className="max-w-3xl mx-auto p-8">
        <nav className="card flex pl-8 pr-4 py-4 items-center justify-between">
            <ul className="flex gap-8 text-stone-500 dark:text-stone-400">
              <li><a href="/" className="link">Home</a></li>
              <li><a href="#" className="link">Projects</a></li>
              <li><a href="#" className="link">Contact</a></li>
            </ul>
            <button
              onClick={toggleTheme} 
              className="p-3 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg"
          >
            {theme === "dark" ? <LuMoon /> : <LuSun />}
          </button>
        </nav>
      </header>

      <main className="max-w-3xl px-8 mx-auto flex flex-col gap-8">
        <section className="card p-10 flex justify-between gap-12 items-center">

          <div className="w-2/5 flex-shrink-0 h-[275px] overflow-hidden rounded-2xl">
            <img
              className="w-full h-full object-cover scale-140 translate-y-8 -translate-x-2"
              alt="Photo of me" 
              src="src/assets/IMG-20250131-WA0057.jpg"
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold">Hi, I'm Dylan.</h1>
            <div className="mt-5">
              <p>Developer
                <a href="https://collectiveglobal.net/" target="_blank" className="link"> @ Collective Global</a>
              </p>
              <p>Instructor
                <a href="https://bsd.education/" target="_blank" className="link"> @ BSD Education</a>
              </p>
              <p>Student
                <a href="https://hku.hk/" target="_blank" className="link"> @ The University of Hong Kong</a>
              </p>
            </div>
            <p className="mt-3 text-pretty">I develop solutions for startup companies, teach students throughout Hong Kong, and study computer science in university.</p>
            <div className="flex items-center gap-6 mt-5 text-stone-500 dark:text-stone-400">
              <a href="#" className="link">Resume</a>
              <a href="https://linkedin.com/in/tdporter" target="_blank" className="link"><FaLinkedinIn /></a>
              <a href="https://github.com/dylporter" target="_blank" className="link"><FaGithub/></a>
              <a href="#" className="link"><FaRegEnvelope/></a>
            </div>
          </div>
        </section>
        
        <section className="mt-8 flex flex-col gap-8">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Projects</h2>
            <div className="flex items-center">
              <a href="#" className="link">View More</a>
            </div>
          </div>
          <div className="flex justify-between gap-4 h-[800px]">
            <div className="flex flex-col w-full gap-4">
              <div className="card h-full w-full"></div>
              <div className="card h-2/3 w-full"></div>
            </div>
            <div className="flex flex-col w-full gap-4">
              <div className="card h-2/3 w-full"></div>
              <div className="card h-full w-full"></div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-8">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Blog Posts</h2>
            <div className="flex items-center">
              <a href="#" className="link">View More</a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card h-[150px]"></div>
            <div className="card h-[150px]"></div>
            <div className="card h-[150px]"></div>
          </div>
        </section>

      </main>
    </div>
  )
}

export default App