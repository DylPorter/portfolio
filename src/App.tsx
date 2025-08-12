import { useState, useEffect } from "react";
import { LuSun, LuMoon, LuCopy, LuSend, LuCopyCheck, LuExternalLink } from "react-icons/lu";
import { FaLinkedinIn, FaGithub, FaRegEnvelope } from "react-icons/fa6";

function App() {
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);
  const [dropdownAnimating, setDropdownAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [active, setActive] = useState("experience");

  const email = "info@tdporter.dev"

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const toggleEmailDropdown = () => {
    if (!emailDropdownOpen) {
      setEmailDropdownOpen(true);
      setDropdownAnimating(true);
      setCopied(false);
    } else {
      setDropdownAnimating(false);
      setTimeout(() => setEmailDropdownOpen(false), 150);
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
  };

  // Modified handleSubmit with UI state instead of alert
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('message', formData.message);

    try {
      const res = await fetch('https://formspree.io/f/mjkojdpk', {
        method: 'POST',
        body: form,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });

        setSubmitting(false);

        setTimeout(() => {
          setSubmitted(false);
        }, 10000);
      } else {
        setSubmitting(false);
        console.log("res not ok");
      }
    } catch (error) {
      setSubmitting(false);
      console.log("error caught");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest("#email-dropdown-button") === null &&
        (e.target as HTMLElement).closest("#email-dropdown-menu") === null
      ) {
        setDropdownAnimating(false);

        setTimeout(() => {
          setEmailDropdownOpen(false);
        }, 150);

        setTimeout(() => setCopied(false), 100);
      }
    };

    if (emailDropdownOpen) window.addEventListener("click", handleClickOutside);
    else window.removeEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [emailDropdownOpen]);

  return (
    <div id="top" className={`${theme === "dark" ? "dark" : ""} bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 min-h-screen w-full transition-colors duration-500`}>
      <header className={`sticky top-0 z-50 mx-auto px-4 py-8 md:px-8 transition-all ${scrolled ? "duration-1200 max-w-[410px] md:max-w-lg" : "duration-1200 max-w-full md:max-w-3xl"}`}> 
        <nav className="card flex pl-8 p-4 items-center justify-between">
          <ul className="flex gap-6 md:gap-8">
            <li><a 
              href="/" 
              className="link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("top");
              }}
            >Home</a></li>
            <li><a 
              href="#skills" 
              className="link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("skills");
              }}
            >Skills</a></li>
            <li><a 
              href="#projects" 
              className="link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("projects");
              }}
            >Projects</a></li>
            <li><a 
              href="#contact" 
              className="link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >Contact</a></li>
          </ul>
          <button onClick={toggleTheme} className="p-3 hover-button">
            {theme === "dark" ? <LuMoon /> : <LuSun />}
          </button>
        </nav>
      </header>

      <main className="max-w-3xl px-4 md:px-8 mx-auto flex flex-col gap-4">

        <section id="home" className="flex flex-col gap-4">
          <div className="card p-10 items-center flex flex-col md:flex-row gap-8 md:gap-12 justify-between">
            <div className="w-full md:w-2/5 flex-shrink-0 h-[275px] md:h-[300px] overflow-hidden rounded-xl">
              <img
                className="w-full h-full object-cover md:scale-140 object-[50%_25%] md:translate-y-8 md:-translate-x-2"
                alt="Photo of me" 
                src="./IMG-20250131-WA0057.jpg"
              />
            </div>
            
            <div className="flex flex-col items-center md:items-stretch">
              <h1 className="text-5xl font-bold">Hi, I'm Dylan.</h1>
              <div className="mt-5 flex flex-row flex-wrap gap-x-6 md:flex-col items-center justify-center md:items-start">
                <p>Developer
                  <a href="https://collectiveglobal.net" target="_blank" className="link">{" "}@ Collective Global</a>
                </p>
                <p>Instructor
                  <a href="https://bsd.education" target="_blank" className="link">{" "}@ BSD Education</a>
                </p>
                <p>Student
                  <a href="https://hku.hk" target="_blank" className="link">{" "}@ The University of Hong Kong</a>
                </p>
              </div>
              <p className="mt-4 text-balance text-center md:text-left">I develop solutions for startup companies, teach students throughout Hong Kong, and study computer science in university.</p>
              <div className="flex flex-wrap items-center gap-2 mt-5">
                <a href="./resume.pdf" target="_blank" className="px-4 py-2 text-sm button">Résumé</a>
                <a href="https://linkedin.com/in/tdporter" target="_blank" className="p-3 hover-button"><FaLinkedinIn /></a>
                <a href="https://github.com/dylporter" target="_blank" className="p-3 hover-button"><FaGithub/></a>

                <div className="relative inline-block text-center">
                  <button id="email-dropdown-button" onClick={toggleEmailDropdown} className="p-3 hover-button hover:cursor-pointer">
                    <FaRegEnvelope />
                  </button>

                  {emailDropdownOpen && (
                    <div
                      id="email-dropdown-menu"
                      className={`card p-3 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-50 z-20
                        ${dropdownAnimating ? "dropdown-enter" : "dropdown-leave"}
                      `}
                    >
                      <div className="p-3 text-sm break-words text-neutral-500 dark:text-neutral-400">{email}</div>
                      <div className="flex gap-1 text-sm items-center justify-center">
                        <button
                          onClick={copyEmail}
                          className="w-full py-2 hover-button flex justify-center items-center gap-2 hover:cursor-pointer"
                        >
                          {copied ? <LuCopyCheck className="text-neutral-700 dark:text-neutral-300"/> : <LuCopy />}
                          {copied ? <span className="text-neutral-700 dark:text-neutral-300">Copied!</span> : "Copy"}
                        </button>
                        <a href={`mailto:${email}`} className="w-full py-2 hover-button gap-2">
                          <LuSend />Send
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-2 mt-4">
            <div className="flex gap-2 w-full h-full rounded-lg">
              <button
                className={`w-1/2 py-1.5 text-sm rounded-lg hover:cursor-pointer transition-colors duration-500 ${active === "experience" ? "bg-neutral-200 dark:bg-neutral-800" : "text-neutral-500 dark:text-neutral-400"}`}
                onClick={() => setActive("experience")}
              >Experience</button>
              <button 
                className={`w-1/2 py-1.5 text-sm rounded-lg hover:cursor-pointer transition-colors duration-500 ${active === "education" ? "bg-neutral-200 dark:bg-neutral-800" : "text-neutral-500 dark:text-neutral-400"}`}
                onClick={() => setActive("education")}
              >Education</button>
            </div>
          </div>

          <div className="relative">
            {/* Experience Card */}
            <div className={`card p-8 text-sm flex flex-col gap-4 ${active === "experience" ? "block" : "hidden"}`}>

              {/* Collective */}
              <div>
                <div className="flex items-center mb-2">
                  <img className="icon mr-4" src="./collective_logo.jpg"></img>
                  <div className="flex flex-col gap-0.25">
                    <p className="font-bold text-base">Collective Global</p>
                    <p className="-mt-0.5">Full Stack Developer (Contract)</p>
                    <p className="text-xs dark:text-neutral-400">Jul 2024 – Present</p>
                  </div>
                </div>
                <p className="ml-16">blablabla this is some of the cool stuff that i did hopefully that's useful for you</p>
              </div>

              <hr className="border-t border-neutral-300 dark:border-neutral-700 my-1" />

              {/* BSD Teaching */}
              <div>
                <div className="flex items-center mb-2">
                  <img className="icon mr-4" src="./bsdeducation_logo.jpg"></img>
                  <div className="flex flex-col gap-0.25">
                    <p className="font-bold text-base">BSD Education</p>
                    <p className="-mt-0.5">Coding Instructor (Part-time)</p>
                    <p className="text-xs dark:text-neutral-400">May 2025 – Present</p>
                  </div>
                </div>
                <p className="ml-16">I did teaching here it was very cool</p>
              </div>

              <hr className="border-t border-neutral-300 dark:border-neutral-700 my-1" />

              {/* BSD Intern */}
              <div>
                <div className="flex items-center mb-2">
                  <img className="icon mr-4" src="./bsdeducation_logo.jpg"></img>
                  <div className="flex flex-col gap-0.25">
                    <p className="font-bold text-base">BSD Education</p>
                    <p className="-mt-0.5">Developer (Internship)</p>
                    <p className="text-xs dark:text-neutral-400">Sep 2023 – Mar 2024</p>
                  </div>
                </div>
                <p className="ml-16">blablabla this is some of the cool stuff that i did hopefully that's useful for you</p>
              </div>

            </div>

            {/* Education Card */}
            <div className={`card p-8 text-sm flex flex-col gap-4 ${active === "education" ? "block" : "hidden"}`}>

              {/* HKU */}
              <div>
                <div className="flex items-center mb-2">
                  <img className="icon mr-4" src="./hku_logo.jpeg"></img>
                  <div className="flex flex-col gap-0.25">
                    <p className="font-bold text-base">The University of Hong Kong</p>
                    <p className="-mt-0.5">BEng in Computer Science</p>
                    <p className="text-xs dark:text-neutral-400">Sep 2024 – Due Jun 2028</p>
                  </div>
                </div>
                <p className="ml-16">blablabla this is some of the cool stuff that i did hopefully that's useful for you</p>
              </div>

              <hr className="border-t border-neutral-300 dark:border-neutral-700 my-1" />

              {/* DSC */}
              <div>
                <div className="flex items-center mb-2">
                  <img className="icon mr-4" src="./dsc_logo.jpg"></img>
                  <div className="flex flex-col gap-0.25">
                    <p className="font-bold text-base">DSC International School</p>
                    <p className="-mt-0.5">Ontario Secondary School Diploma</p>
                    <p className="text-xs dark:text-neutral-400">Jan 2017 – Jun 2024</p>
                  </div>
                </div>
                <p className="ml-16">blablabla this is some of the cool stuff that i did hopefully that's useful for you</p>
              </div>
            </div>
          </div>

        </section>

        <section id="skills" className="pt-32 -mt-24 flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center md:text-start">Skills</h2>
          <div className="card p-8">
              
          </div>
        </section>
        
        <section id="projects" className="pt-32 -mt-24 flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center md:text-start">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full" style={{ gridAutoRows: 'auto' }}>

            {/* SourcingGPT */}
            <div className="card p-8 flex flex-col sourcinggpt-span order-1">
              <div className="w-full overflow-hidden rounded-xl h-60 md:h-auto object-[90%_65%]">
                <img
                  className="w-full h-full object-cover object-[50%_0%]"
                  alt="Project image"
                  src="./sourcinggpt.png"
                />
              </div>
              <h3 className="text-2xl font-bold mt-5">SourcingGPT</h3>
              <p className="mt-3 mb-4 text-balance">An agentic AI system designed to automate and enhance the sourcing process.</p>
              <div className="flex flex-row flex-wrap text-xs gap-1">
                <div className="pill">LLMs</div>
                <div className="pill">RAG</div>
                <div className="pill">AWS</div>
                <div className="pill">n8n</div>
                <div className="pill">JavaScript</div>
                <div className="pill">Firebase</div>
                <div className="pill">React</div>
                <div className="pill">PostgreSQL</div>
              </div>
              <a href="https://app.sourcinggpt.ai" target="_blank" className="self-start px-4 py-2 text-sm button mt-5 gap-2"><LuExternalLink/>View</a>
            </div>

            {/* TwinToys */}
            <div className="card p-8 flex flex-col twintoys-span order-4">
              <h3 className="text-2xl font-bold">TwinToys</h3>
              <p className="mt-3 mb-4 text-balance">An AI-powered tool to convert 2D images of toys into immersive and usable 3D models.</p>
              <div className="flex flex-row flex-wrap text-xs gap-1">
                <div className="pill">Python</div>
                <div className="pill">JavaScript</div>
                <div className="pill">AWS</div>
                <div className="pill">Meshy API</div>
                <div className="pill">WordPress</div>
              </div>
              <a href="https://twintoys.co" target="_blank" className="self-start px-4 py-2 text-sm button mt-5 gap-2"><LuExternalLink/>View</a>
            </div>

            {/* ARFixit */}
            <div className="card p-8 flex flex-col arfixit-span order-2">
              <h3 className="text-2xl font-bold">ARFixit</h3>
              <p className="mt-3 mb-4 text-balance">An augmented reality mobile application developed for do-it-yourself home repair solutions.</p>
              <div className="flex flex-row flex-wrap text-xs gap-1">
                <div className="pill">Unity</div>
                <div className="pill">C#</div>
                <div className="pill">Vuforia Engine</div>
                <div className="pill">Vuforia MTG</div>
                <div className="pill">3D Modelling</div>
              </div>
              <a href="https://arfixit.co" target="_blank" className="self-start px-4 py-2 text-sm button mt-5 gap-2"><LuExternalLink/>View</a>
            </div>

            {/* VETsage */}
            <div className="card p-8 flex flex-col vetsage-span order-3">
              <div className="w-full overflow-hidden rounded-xl h-60 md:h-auto object-[90%_65%]">
                <img
                  className="w-full h-full object-cover object-[50%_0%]"
                  alt="Project image"
                  src="./vetsage.png"
                />
              </div>
              <h3 className="text-2xl font-bold mt-5">VETsage</h3>
              <p className="mt-3 mb-4 text-balance">A retrieval-augmented generation AI system created to streamline veterinary workflows.</p>
              <div className="flex flex-row flex-wrap text-xs gap-1">
                <div className="pill">LLMs</div>
                <div className="pill">RAG</div>
                <div className="pill">AWS</div>
                <div className="pill">n8n</div>
                <div className="pill">JavaScript</div>
                <div className="pill">Python</div>
                <div className="pill">React</div>
                <div className="pill">PostgreSQL</div>
              </div>
              <a href="https://app.vetsage.ai" target="_blank" className="self-start px-4 py-2 text-sm button mt-5 gap-2"><LuExternalLink/>View</a>
            </div>
          </div>
        </section>

        {/* Blog Section
        <section id="blog" className="pt-32 -mt-24 flex flex-col gap-8">
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
        */}

        <section id="contact" className="pt-32 -mt-24 flex flex-col gap-8">
          <h2 className="text-3xl font-bold text-center md:text-start">Contact</h2>
          <div className="card p-10">

            <div className="mb-6 text-center">
              <h1 className="text-5xl font-bold mb-5">Contact Me.</h1>
              <p className="text-balance mb-2">I’m available for projects, discussions, and inquiries.</p>
              <p className="mb-4 text-balance">Email me at 
                <a href={`mailto:${email}`}
                className="link"
                >{" "}{email},{" "}</a>
              or reach out by filling out the form.</p>
            </div>

            <form className="flex flex-col" autoComplete="off" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <input type="text" name="name" required 
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="text-base input input-box w-full" placeholder="Your Name"
                  />
                <input type="email" name="email" required 
                  pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                  title="Please enter a valid email address with a domain suffix of at least 2 letters"
                  value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="input input-box w-full" placeholder="you@email.com"
                />
              </div>
              <textarea name="message" required rows={5} 
                value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="input input-box resize-none" placeholder="What would you like to talk about?"
              />

              <button type="submit" disabled={submitting} 
                className="button mt-6 px-4 py-2 text-sm flex justify-center items-center gap-2 self-center min-w-[140px]"
              >
                {submitting ? (<span>Sending...</span>) : submitted ? (
                  <>
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <LuSend />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </section>

      </main>

      <footer className="mx-auto p-4 md:p-8 mt-4 md:mt-8 md:max-w-3xl">
        <div className="card p-6 text-center text-neutral-500 dark:text-neutral-400 text-sm">
          <p>© 2025
            <a href="" 
            className="link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("top");
            }}
          >{" "}tdporter.dev</a></p>
          <p>Last updated: August 13th, 2025</p>
        </div>
      </footer>
    </div>
  )
}

export default App