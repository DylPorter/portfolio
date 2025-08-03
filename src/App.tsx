import { useState, useEffect } from "react";
import { LuSun, LuMoon } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope } from "react-icons/fa6";

function App() {
  const [ theme, setTheme ] = useState('dark');
  const [ scrolled, setScrolled ] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${theme === "dark" ? "dark" : ""} bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen w-full pb-16`}>
      <header 
        className={`sticky top-0 z-50 mx-auto p-8 transition-all ${scrolled ? "duration-700 max-w-lg md:max-w-xl" : "duration-500 max-w-3xl"}`}>
        <nav className="card flex pl-8 p-4 items-center justify-between">
          <ul className="flex gap-8">
            <li><a 
              href="#" 
              className="link"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >Home</a></li>
            <li><a href="#projects" className="link">Projects</a></li>
            <li><a href="#contact" className="link">Contact</a></li>
          </ul>
          <button
            onClick={toggleTheme} 
            className="p-3 hover-button"
          >
          {theme === "dark" ? <LuMoon /> : <LuSun />}
          </button>
        </nav>
      </header>

      <main id="home" className="max-w-3xl px-8 mx-auto flex flex-col gap-8">

        <section className="card p-10 flex flex-col md:flex-row justify-between gap-8 md:gap-12 items-center">
          <div className="w-full md:w-2/5 flex-shrink-0 h-[275px] md:h-[300px] overflow-hidden rounded-xl">
            <img
              className="w-full h-full object-cover md:scale-140 object-[50%_25%] md:translate-y-8 md:-translate-x-2"
              alt="Photo of me" 
              src="src/assets/IMG-20250131-WA0057.jpg"
            />
          </div>
          
          <div className="flex flex-col items-center md:items-stretch">
            <h1 className="text-5xl font-bold">Hi, I'm Dylan.</h1>
            <div className="mt-5 flex flex-row flex-wrap gap-x-6 md:flex-col items-center justify-center md:items-start">
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
            <p className="mt-4 text-balance text-center md:text-left">I develop solutions for startup companies, teach students throughout Hong Kong, and study computer science in university.</p>
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <a href="#" className="px-4 py-2 text-sm button">Resume</a>
              <a href="https://linkedin.com/in/tdporter" target="_blank" className="p-3 hover-button"><FaLinkedinIn /></a>
              <a href="https://github.com/dylporter" target="_blank" className="p-3 hover-button"><FaGithub/></a>
              <a href="#" className="p-3 hover-button"><FaRegEnvelope/></a>
            </div>
          </div>
        </section>
        
        <section id="projects" className="pt-32 -mt-24 flex flex-col gap-8">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Projects</h2>
            <div className="flex items-center">
              <a href="#" className="link">View More</a>
            </div>
          </div>

          <div className="flex justify-between gap-4 h-[800px]">
            <div className="flex flex-col w-full gap-4">
              <div className="card h-full w-full p-8">
                <div className="w-full h-1/2 overflow-hidden rounded-xl">
                  <img
                    className="w-full h-full object-cover"
                    alt="Project image"
                    src="https://i0.wp.com/www.coalitionrc.com/wp-content/uploads/2017/01/placeholder.jpg?resize=300%2C300&ssl=1"
                  />
                </div>
                <h3 className="text-2xl font-bold mt-4">SourcingGPT.ai</h3>
                <p className="mt-2">bla bla bla bla blab la blab lab la</p>
                <a href="#" className="px-4 py-2 text-sm button mt-5">View</a>
              </div>

              <div className="card h-2/3 w-full p-8">
                <h3 className="text-2xl font-bold">TwinToys</h3>
                <p className="mt-2">bla bla bla bla blab la blab lab la</p>
                <a href="#" className="px-4 py-2 text-sm button mt-5">View</a>
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <div className="card h-2/3 w-full p-8">
                <h3 className="text-2xl font-bold">ARFixit</h3>
                <p className="mt-2">bla bla bla bla blab la blab lab la</p>
                <a href="#" className="px-4 py-2 text-sm button mt-5">View</a>
              </div>

              <div className="card h-full w-full p-8">
                <div className="w-full h-1/2 overflow-hidden rounded-xl">
                  <img
                    className="w-full h-full object-cover"
                    alt="Project image"
                    src="https://i0.wp.com/www.coalitionrc.com/wp-content/uploads/2017/01/placeholder.jpg?resize=300%2C300&ssl=1"
                  />
                </div>
                <h3 className="text-2xl font-bold mt-4">VETsage</h3>
                <p className="mt-2">bla bla bla bla bla bla bla bla blab la bla</p>
                <a href="#" className="px-4 py-2 text-sm button mt-5">View</a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="pt-32 -mt-24 flex flex-col gap-8">
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