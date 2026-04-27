// The book.  Each section carries a `year` — reading order is chronological.
// Sequential page numbers (01, 02, …) are assigned after sort.
//
// Thesis: software maintenance is at least NP-hard, and several of its core
// subproblems are formally undecidable.  AI tools help the polynomial-time
// parts (writing locally-coherent code) and degrade the NP-hard parts
// (preserving global invariants under change).  Safety-critical software is
// the existence proof that the trap can be escaped, but only by paying a
// proof tax the rest of the industry has refused to pay.
//
// Page schema:
//   title     — the paper or concept name
//   year      — sort key for the timeline
//   country   — ISO 3166-1 alpha-2 code; `flag()` converts to emoji
//   class     — architectural axis: undecidable | NP-complete | NP-hard | P | meta
//   gesture   — main idea, one sentence
//   body      — deep technical perspective, 100–150 words
//   eli5      — layman's terms, 3–6× body, ends on Hard Way punch
//   cultural  — cultural / political / economic context, 3–5 sentences
//   citation  — academic citation
//   link      — primary source URL

const raw = [
  {
    title: 'On Computable Numbers',
    year: 1936,
    country: 'GB',
    class: 'undecidable',
    gesture: 'Alan Turing, 1936 — there is no general procedure to decide whether an arbitrary program halts.  The first wall any solver hits.',
    body: 'Alan Turing, working at Cambridge and soon to leave for Princeton, defined a universal computing machine and proved that the Halting Problem — given a program and an input, decide whether the program eventually stops — has no algorithmic solution.  The proof is a diagonal argument: assume a halting decider exists, construct a program that consults the decider on itself and does the opposite, and contradiction follows.  The result predates electronic computers.  It is the foundational impossibility result of computer science, and the ceiling above which no software-verification tool, no AI system, no formal method can ever rise.  Every later impossibility result in this book — Rice 1953, the NP-completeness barrier, the limits of static analysis — descends from this one paper.',
    cultural: `Britain in 1936 was rearming and the foundations of mathematics were in upheaval.  Gödel had published his incompleteness theorems five years earlier, shaking the Hilbert program that had organized the discipline since 1900.  Turing was twenty-four, recently elected to a fellowship at King's College, Cambridge, and addressing Hilbert's Entscheidungsproblem — the question of whether a mechanical procedure could decide every mathematical statement.  No electronic computer existed.  The Manchester Mark 1 was thirteen years away.  Turing was reasoning about machines that did not yet exist, and his definition of one was so precise that it became the standard.`,
    citation: 'Turing, A. M. (1937). *On Computable Numbers, with an Application to the Entscheidungsproblem.* Proceedings of the London Mathematical Society, s2-42(1), 230–265.',
    link: 'https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf',
    eli5: `Imagine a tool that reads any program you hand it and answers, before running it, whether the program will eventually finish or run forever.  Such a tool would be the answer to most questions in software.  You could check, in advance, whether your code will hang.  You could check whether a regression in the new version preserves the old behavior.  You could check whether a refactor is safe.  Turing proved, in 1936, that this tool cannot exist.  Not "we have not built it yet."  Not "it is too slow."  Cannot exist, mathematically, ever.

The proof is short and brutal.  Suppose the tool exists.  Call it Halts.  Build a new program, Liar, that asks Halts what Liar itself will do — and then does the opposite.  If Halts says Liar halts, Liar runs forever.  If Halts says Liar runs forever, Liar halts immediately.  Either way Halts has lied about Liar.  But Halts was supposed to be always correct.  Contradiction.  No such tool exists.

This is the ceiling.  Every later result in this book — Rice's theorem, the undecidability of program equivalence, the NP-hardness of every interesting maintenance problem — sits underneath this 1936 proof.  When you read in chapter four that you cannot, in general, decide whether a refactor preserves behavior, you are reading a corollary of this paper.  When you read in chapter sixteen that AI cannot prove its own output correct, you are reading the same corollary.

The first wall.  No solver crosses it.`
  },
  {
    title: "Rice's Theorem",
    year: 1953,
    country: 'US',
    class: 'undecidable',
    gesture: 'Henry Gordon Rice, 1953 — every non-trivial question about a program\'s behavior is undecidable.  Refactoring without breaking is, in the limit, impossible.',
    body: 'Henry Gordon Rice, in his Syracuse PhD thesis, proved a sweeping generalization of the Halting Problem.  A *semantic* property of a program is any property of its behavior — does it terminate, does it produce a given output, does it satisfy a given specification, does it behave like this other program.  Rice proved that every non-trivial semantic property is undecidable.  "Non-trivial" means there exists at least one program with the property and at least one without.  The proof reduces the question to halting.  The implication for software maintenance is direct and devastating: the question "does this refactored version behave the same as the original" is a non-trivial semantic property, and is therefore undecidable in the general case.  No tool, no compiler, no AI system can answer it for arbitrary programs.',
    cultural: `Postwar America had the world's first stored-program computers in operation — UNIVAC I shipped in 1951 — and a generation of mathematicians was discovering that the deepest questions about these machines were already settled.  Rice was a graduate student at Syracuse, working in pure recursion theory under the influence of Kleene and Post.  IBM's commercial computing business was three years from the 704.  The field was still mostly mathematics.  No one in 1953 imagined that Rice's theorem would later govern what could be promised by a billion-dollar AI coding industry.  But it does.`,
    citation: 'Rice, H. G. (1953). *Classes of Recursively Enumerable Sets and Their Decision Problems.* Transactions of the American Mathematical Society, 74(2), 358–366.',
    link: 'https://www.ams.org/journals/tran/1953-074-02/S0002-9947-1953-0053041-6/',
    eli5: `Turing's halting problem is one specific question — does this program stop.  Rice asked: what about other questions?  Does this program ever output the number seven.  Does this program loop forever on at least one input.  Does this version behave the same as that version.  Are these two functions equivalent.

Rice proved all of those questions are undecidable.  Every single one.  As long as the question is about *behavior* rather than *syntax*, and as long as the answer is sometimes yes and sometimes no, you cannot build a tool that always answers correctly.

This is the theorem that decides whether automated maintenance is possible.  It is not.  Not in the general case.  Asking "does this change preserve behavior" is exactly the kind of non-trivial semantic question Rice ruled out.  When a static analyzer claims to detect bugs, it is using approximations and giving up completeness — it will miss bugs, or flag false ones, or both.  Rice's theorem is why.  When a compiler refuses to optimize a piece of code, it is because deciding whether the optimization preserves behavior is, in general, this same undecidable question.  When an AI tool refactors your code and the tests pass, the tests passing means *the tested behaviors* are preserved.  Rice's theorem tells you nothing else can be promised.

This is the second floor.  Above the halting problem, below NP.  The room where every interesting question about software lives, and where no tool can ever answer them all.

Every meaningful question about behavior, undecidable.  Maintenance, undecidable in the limit.`
  },
  {
    title: 'Paths, Trees, and Flowers',
    year: 1965,
    country: ['CA', 'US'],
    class: 'P',
    gesture: 'Jack Edmonds, 1965 — polynomial time is the right definition of "tractable."  The benchmark by which everything in this book is later judged hard.',
    body: 'Jack Edmonds, working at the National Bureau of Standards, gave the first polynomial-time algorithm for maximum matching in general graphs.  In doing so he made the methodological argument that polynomial running time should be the formal definition of "efficient" — distinguishing algorithms whose cost grows as a power of the input size from algorithms whose cost grows exponentially.  The argument, now called the Cobham–Edmonds thesis, is the reason "P" is the class it is.  Without this paper there is no P, and without P there is no NP, and without NP there is no NP-hard.  The complexity hierarchy this book uses to classify every later problem rests on the line Edmonds drew between polynomial and exponential cost.',
    cultural: `Mid-1960s America was funding operations research at scale.  The National Bureau of Standards employed mathematicians to optimize logistics, transportation, and computation for the Cold War economy.  Combinatorial optimization was a young field; the simplex method for linear programming was the celebrity algorithm.  Edmonds, Canadian by birth, was at NBS in Washington when he proved that maximum matching admitted a polynomial algorithm.  The discipline was small enough that one paper could redraw its boundaries.  This one did.`,
    citation: 'Edmonds, J. (1965). *Paths, Trees, and Flowers.* Canadian Journal of Mathematics, 17, 449–467.',
    link: 'https://www.cambridge.org/core/journals/canadian-journal-of-mathematics/article/paths-trees-and-flowers/08B492B72322C4130AE800C0610E0E21',
    eli5: `Before Edmonds, "fast enough" was a vibe.  An algorithm was good if it ran in reasonable time on the inputs you cared about.  A few researchers had noticed that algorithms tend to fall into two families — those whose cost scales gently as the input grows, and those that explode — but no one had drawn the line formally and made the case.

Edmonds drew the line and made the case.  Polynomial running time, he argued, is the mathematically natural definition of efficiency.  An algorithm in O(n²) or O(n³) is efficient; an algorithm in O(2ⁿ) is not, and on inputs of any size that matters it never will be.  The argument is not that polynomial algorithms are always fast in practice — n¹⁰⁰ is polynomial and useless.  The argument is that the gap between polynomial and exponential is the only gap that does not eventually close as hardware improves.  An exponential algorithm cannot be saved by a faster computer.  A polynomial algorithm can.

This is the line that defines the class P.  And once P exists, NP exists — the class of problems whose solutions can be *verified* in polynomial time.  And once NP exists, NP-hard exists — the class at least as hard as NP.  And once NP-hard exists, this entire book has a vocabulary.

When chapter six tells you that test suite minimization is NP-complete and chapter eight tells you package dependency resolution is NP-complete, those statements only mean something because Edmonds drew this line first.  He drew the line, and the matching algorithm in the same paper proved a problem could sit on the easy side of it.  Maximum matching, against everyone's expectations at the time, turned out to be in P.

The first easy side.  The first hard side.  The line every later page in this book stands on.`
  },
  {
    title: 'An Axiomatic Basis for Computer Programming',
    year: 1969,
    country: 'GB',
    class: 'meta',
    gesture: 'Tony Hoare, 1969 — programs can be reasoned about with mathematical precision.  The first technique that makes maintenance survivable.',
    body: 'Tony Hoare, then at the Queen\'s University of Belfast, published a system of inference rules for proving the correctness of computer programs.  The central object is the Hoare triple: a precondition, a program fragment, and a postcondition, denoted {P} S {Q}.  The triple asserts that if P holds before S runs, then Q holds after.  Hoare gave axioms for assignment, sequencing, conditionals, and loops, with a separate rule for each.  Together these rules let a programmer construct a proof, alongside the code, that the code does what it claims.  This is the technical foundation of every later formal-methods system in this book — Dijkstra\'s weakest preconditions, separation logic, SPARK, Coq, Isabelle, Dafny, the proofs of seL4 and CompCert.  It is the only technique humans have invented that beats Rice\'s theorem on a per-program basis.',
    cultural: `Northern Ireland was at the start of the Troubles when Hoare published this paper from Belfast.  British academic computing, led by Strachey at Oxford and Dijkstra in Eindhoven, was in a foundational mood — Dijkstra had just published "Go To Statement Considered Harmful" the year before, opening the structured-programming debate.  The idea that programs were mathematical objects that could be reasoned about formally was new and contested.  IBM's commercial software industry was already showing the maintenance pathologies that Lehman would later name.  Hoare's triple was the response of pure computer science to applied chaos.`,
    citation: 'Hoare, C. A. R. (1969). *An Axiomatic Basis for Computer Programming.* Communications of the ACM, 12(10), 576–580.',
    link: 'https://dl.acm.org/doi/10.1145/363235.363259',
    eli5: `Rice's theorem says no general-purpose tool can decide whether an arbitrary program is correct.  Hoare did not contradict Rice — he sidestepped him.  His insight was that you do not need a general-purpose tool that works for any program.  You need a system in which a programmer can construct a *specific* proof for a *specific* program.  The proof goes alongside the code, and the proof is checked mechanically.

The shape of a Hoare proof is the triple — three pieces, written in a row.  The thing that must be true before this code runs.  The code itself.  The thing that must be true after.  Hoare gave you the rules for combining triples.  If you want to prove a sequence of two statements, you prove a triple for each and chain them at the middle assertion.  If you want to prove a loop, you find an *invariant* — a statement that is true before the loop, true after every iteration, and that combined with the loop's exit condition gives you the postcondition.  Loop invariants are hard.  They are the heart of programming as a discipline.

This is the first technique in the book that beats undecidability on a per-program basis.  Rice's theorem still holds: there is no algorithm that proves an arbitrary program correct.  But there is a *language* in which a human can construct a proof, and a checker that verifies the proof is valid.  This is the key that opens every door later in the book.  When you read about CompCert proving a C compiler correct, the proof is in a descendant of Hoare logic.  When you read about seL4 proving an operating system kernel correct, same.  When you read that Praxis proved Tokeneer to EAL5 in SPARK Ada, same.

The triple is the price of correctness.  Pay it or guess.`
  },
  {
    title: 'The Apollo Guidance Computer and the Birth of Software Engineering',
    year: 1969,
    country: 'US',
    class: 'meta',
    gesture: 'Margaret Hamilton, MIT Instrumentation Lab, 1965–69 — wrote the code that landed humans on the moon and named the discipline that made it possible.',
    body: 'Margaret Hamilton led the Software Engineering Division of the MIT Instrumentation Laboratory during the development of the on-board flight software for the Apollo Guidance Computer.  She and her team wrote the asynchronous, priority-driven executive that ran on roughly 64 KB of memory and successfully landed Apollo 11 on the Moon in July 1969 — including the now-famous moment when overload alarms during descent triggered the executive\'s priority logic to discard lower-priority tasks rather than crash, allowing the landing to proceed.  Hamilton coined the term "software engineering" specifically to argue that what she and her team did deserved the same respect as hardware engineering and systems engineering.  At the time the term was treated as a joke.  The discipline she named is the one this book argues the industry has since forgotten.',
    cultural: `The United States was spending close to four percent of the federal budget on Apollo at its peak.  The Cold War had made the Moon a strategic objective; Sputnik twelve years earlier had set the timeline.  The Instrumentation Lab at MIT was a contractor of unusual depth, and Hamilton was a young woman in a discipline that did not yet exist.  Software was widely considered subordinate to hardware — something programmers did, not something engineers did.  Hamilton chose the word "software engineering" to push back, and she wrote the code that landed humans on the Moon.  Both moves were ahead of their time.`,
    citation: 'Hamilton, M. H. (1969). *Apollo Guidance Computer Software.* MIT Instrumentation Laboratory.  See also Mindell, D. A. (2008). *Digital Apollo.* MIT Press.',
    link: 'https://www.smithsonianmag.com/smithsonian-institution/margaret-hamilton-led-nasa-software-team-landed-astronauts-moon-180971575/',
    eli5: `In 1965 software was not a profession.  It was something mathematicians and physicists did to get the real work done.  No one had a degree in it.  No one had a name for it.  Hamilton was running a team writing the code that would carry three astronauts to the Moon and back, and the code had to work the first time.  No patches.  No updates.  One shot.

The Apollo Guidance Computer had about 64 KB of memory.  The flight software ran an asynchronous priority-driven executive — meaning multiple tasks shared the CPU, and when the system was overloaded the executive killed low-priority work to keep the high-priority work running.  Six minutes before Apollo 11 landed on the Moon, a hardware misconfiguration flooded the computer with extra work and the executive started throwing out the lower-priority tasks.  The crew saw "1202" and "1201" alarms.  Mission control had to decide, in seconds, whether to abort.  They did not abort.  The system was doing exactly what Hamilton had designed it to do — shedding load gracefully under overload — and the landing proceeded.

Hamilton called what her team was doing "software engineering" because she wanted it to be taken seriously.  At the time the senior engineers laughed.  By the late 1980s the term was universal.  By 2010 it was a degree program in every research university on Earth.

But the discipline she named was not just the word.  It was a set of practices: write specifications first, prove the program against the specification, design for failure rather than against it, treat the software as the system that has to keep working when everything else does not.  This is the discipline Hoare's triples make possible, the one DO-178C codifies for aviation, the one seL4 demonstrates is achievable.  It is the discipline that makes software a profession instead of a craft.

She named the discipline so it could be respected.  We forgot the discipline.`
  },
  {
    title: 'The Complexity of Theorem-Proving Procedures',
    year: 1971,
    country: 'CA',
    class: 'NP-complete',
    gesture: 'Stephen Cook, 1971 — Boolean satisfiability is the canonical hard problem.  Every NP problem reduces to it.  The bottleneck has a name.',
    body: 'Stephen Cook, at the University of Toronto, defined polynomial-time reduction and proved that the Boolean satisfiability problem (SAT) — given a Boolean formula, decide whether there exists an assignment of true/false values to its variables that makes the formula true — is NP-complete.  The proof showed that any non-deterministic Turing machine running in polynomial time can be encoded as a SAT instance whose satisfying assignment corresponds to an accepting computation.  This established the existence of a single problem to which every problem in NP can be reduced in polynomial time.  Leonid Levin proved the same result independently in the Soviet Union in 1973, and the result is now known as the Cook–Levin theorem.  Every later NP-hardness proof in this book — for test suite minimization, package dependency resolution, module clustering, register allocation — descends from Cook 1971.',
    cultural: `Toronto in 1971 was a quietly confident scientific city, four years past Canada's centennial and host to a young computer-science department that would soon be among the world's strongest.  Cook had just been denied tenure at Berkeley two years earlier in part because the department did not believe complexity theory was a real field.  He moved to Toronto, proved this theorem, and the field he was supposed to be inventing turned out to be inventable.  Independently, Leonid Levin in the Soviet Union proved the same result in 1973 — separated from Cook by the Iron Curtain and the language barrier.  Two scientists, two systems, one floor of hardness.`,
    citation: 'Cook, S. A. (1971). *The Complexity of Theorem-Proving Procedures.* Proceedings of the 3rd Annual ACM Symposium on Theory of Computing, 151–158.',
    link: 'https://www.cs.toronto.edu/~sacook/homepage/1971.pdf',
    eli5: `Edmonds drew the line between polynomial and exponential.  Cook found the bottleneck.

A reduction is a translation.  If I can take any instance of problem A and quickly translate it into an instance of problem B, such that solving B gives me the answer to A, then B is at least as hard as A.  Cook's insight was that every problem in NP — every problem whose solution can be checked in polynomial time — can be translated, in polynomial time, into a Boolean satisfiability instance.  Every one.  Test suite minimization.  Package dependency resolution.  Optimal register allocation.  All of them, when you strip the domain language, are SAT problems wearing different hats.

This is why the book uses NP-completeness as a unit of measurement.  Saying "module clustering is NP-hard" is shorthand for: there is a polynomial-time translation from SAT to module clustering, so a fast solver for module clustering would give us a fast solver for SAT, and a fast solver for SAT would give us a fast solver for *every problem in NP*.  We do not believe such a solver exists.  Fifty-five years of trying have produced nothing.

The practical consequence is everywhere.  When apt or dnf resolves your package dependencies, it is running a SAT solver, because Di Cosmo's reduction (chapter eight) shows the dependency problem is NP-complete.  When a static analyzer asks whether a piece of code can ever reach a certain state, it reduces the question to SAT.  When a compiler decides which variables get to live in registers, it is solving an instance of a problem reducible to SAT.  When a model checker verifies that a hardware circuit meets its specification, same.  The world's hardest problems all turn out to be the same problem in different costumes, and that one problem is SAT.

One problem.  Every other hard problem reduces to it.  The bottleneck has a name.`
  },
  {
    title: 'Reducibility Among Combinatorial Problems',
    year: 1972,
    country: 'US',
    class: 'NP-complete',
    gesture: 'Richard Karp, 1972 — twenty-one classical problems, all NP-complete.  The map of hardness everyone draws from.',
    body: 'Richard Karp, at the University of California, Berkeley, took Cook\'s 1971 result and showed that NP-completeness was not a curiosity confined to satisfiability.  In a single paper Karp proved that twenty-one classical combinatorial problems — including 0-1 integer programming, clique, vertex cover, set cover, Hamiltonian circuit, the traveling salesman problem, partition, knapsack, and graph coloring — are all NP-complete.  Each proof is a polynomial-time reduction from a known NP-complete problem to the next.  The paper turned NP-completeness from a single result into a *theory* and a working method: when you encounter a new problem, look for a reduction from one of these twenty-one and you are done.  Every NP-completeness proof in software engineering since 1972 — including the ones in chapters six, seven, and eight of this book — uses Karp\'s template.',
    cultural: `Berkeley in 1972 was the intellectual center of the American counterculture and one of the world's strongest mathematical computer-science departments at the same time.  Karp had moved from IBM Research two years earlier.  The Vietnam War was at its peak; UC Berkeley faculty were prominent in opposition.  The young field of theoretical computer science was building its grammar in real time, and Karp's paper gave it a working method that has not been replaced in fifty-four years.  When a new optimization problem appears, the first question is whether it is NP-complete.  The second question is which Karp-21 problem reduces to it.`,
    citation: 'Karp, R. M. (1972). *Reducibility Among Combinatorial Problems.* In R. E. Miller & J. W. Thatcher (Eds.), *Complexity of Computer Computations* (pp. 85–103). Plenum Press.',
    link: 'https://people.eecs.berkeley.edu/~luca/cs172/karp.pdf',
    eli5: `Cook's paper was a single result with profound implications.  Karp's paper was the implication, harvested.

What Karp showed, in twenty pages, is that the hardness Cook had located in SAT actually permeates classical combinatorics.  Need to schedule classes so no professor teaches two at once?  That is graph coloring, NP-complete.  Need to pack items into a knapsack to maximize value?  Knapsack, NP-complete.  Need to find the cheapest tour through a set of cities?  Traveling salesman, NP-complete.  Need to find the smallest set of guards that watches every hallway in a museum?  Vertex cover, NP-complete.

Each of these problems was already known and already studied.  Some of them had been studied for centuries.  What Karp added was that they were not separate problems with separate difficulties — they were the same problem, in the same complexity class, all reducible to one another in polynomial time.  Solve any one of them quickly and you have solved them all.  Find any one of them is intractable and you have proven the same about every other.

This is the working method of the rest of the book.  When chapter seven reports that module clustering is NP-hard, the reduction is from graph partitioning.  When chapter six reports that test suite minimization is NP-complete, the reduction is from set cover.  When chapter eight reports that package dependency resolution is NP-complete, the reduction is from 3-SAT.  Every time we say "this maintenance subproblem is NP-hard," we mean: there is a polynomial-time reduction from one of Karp's twenty-one to this problem.  Karp gave the field its grammar.

Twenty-one problems.  One floor.  The floor is hard.`
  },
  {
    title: 'Programs, Life Cycles, and Laws of Software Evolution',
    year: 1980,
    country: ['US', 'GB'],
    class: 'meta',
    gesture: 'Manny Lehman, 1980 — software degrades over time.  Maintenance is not a phase; it is the dominant mode.',
    body: 'Manny Lehman, at Imperial College London, formulated a set of empirical laws governing the evolution of large software systems based on his observations at IBM in the 1960s and his subsequent academic study.  The first three laws, originally formulated in 1974: *Continuing Change* — an evolving system must be continually adapted or it becomes progressively less satisfactory.  *Increasing Complexity* — as a system evolves its complexity increases unless explicit work is done to reduce it.  *Self Regulation* — system evolution is self-regulating, with measurable rhythms.  Lehman explicitly invoked the term *entropy* to describe the second law, drawing the analogy to the second law of thermodynamics.  He also reported the figure that defines the discipline: 70% of US software expenditure in 1977 was on maintenance, 30% on new development.  Software degrades.  Maintenance is the work.',
    cultural: `Britain at the end of the 1970s was deindustrializing and rediscovering itself as a research economy.  Lehman had moved from IBM Yorktown Heights to Imperial College London to start the Software Process group, an early attempt to make software engineering an empirical science instead of an art.  The British computer industry — ICL, Marconi, Plessey — was in retreat against IBM and the rising Japanese.  The "software crisis" rhetoric of the late 1960s NATO conferences was still active, but no one had measured the crisis yet.  Lehman's contribution was to start measuring.`,
    citation: 'Lehman, M. M. (1980). *Programs, Life Cycles, and Laws of Software Evolution.* Proceedings of the IEEE, 68(9), 1060–1076.',
    link: 'https://users.ece.utexas.edu/~perry/education/SE-Intro/lehman.pdf',
    eli5: `In the 1960s Manny Lehman ran a research group at IBM that was responsible for OS/360 — at the time the largest software system ever built.  He noticed something that no one had named: the system was not stable.  It was not just that bugs needed fixing.  It was that, every release, the structure got a little worse.  Modules that had been clean became tangled.  Interfaces that had been crisp grew exceptions.  The same engineers who had written elegant code in version one were writing baroque code in version twelve, not because they had gotten worse but because the system had.

Lehman wrote it down.  Software, he said, is not like hardware.  Hardware sits on the shelf and degrades by oxidation.  Software sits in source control and degrades by *use* — every change makes the next change a little harder.  The complexity goes up unless somebody pays explicit cost to bring it back down.  And in industry that cost almost never gets paid, because there is always a feature deadline and a customer waiting and a quarter to close.

He called the phenomenon entropy on purpose.  The second law of thermodynamics says ordered systems become disordered unless energy is supplied.  Lehman's second law says ordered codebases become disordered unless engineering effort is supplied.  The analogy is not metaphorical.  The mechanism is the same: lots of small local changes, each individually rational, none of them aware of the global structure, and the global structure pays the bill.

The 70/30 figure is the one to remember.  In 1977, before the personal computer, before the web, before mobile, before SaaS, before AI — *seventy percent* of the dollars spent on software in the United States were on maintenance.  Not on new features.  On keeping the existing systems running.  And every decade since the figure has gotten worse.

This is why this book is about maintenance and not about programming.  Maintenance is the work.  The empirical research in chapters fifteen through twenty — GitClear, DORA, METR — is just the modern measurement of Lehman's laws under the new tooling.

Software ages.  Pretend otherwise and pay later.`
  },
  {
    title: 'Register Allocation via Graph Coloring',
    year: 1981,
    country: 'US',
    class: 'NP-complete',
    gesture: 'Gregory Chaitin, 1981 — optimal register allocation reduces to graph coloring, which is NP-complete.  Even the compiler is solving an NP-hard problem on every build.',
    body: 'Gregory Chaitin, at IBM Research Yorktown Heights, formulated register allocation as a graph coloring problem and built a compiler that used the reduction.  Each variable in a program becomes a node in an *interference graph*; two nodes are connected if their variables are alive at the same time and therefore cannot share a register.  Coloring the graph with k colors corresponds to assigning each variable to one of k registers.  Graph k-coloring is NP-complete for k ≥ 3 (Karp 1972), so register allocation is NP-complete.  Modern compilers use heuristics — Chaitin\'s graph coloring approach, linear scan, or SSA-based variants — none of which is guaranteed optimal.  Every time gcc, clang, or rustc compiles your code, it is approximating an NP-complete problem.  The hardness is invisible because we have lived with the heuristic for forty years.',
    cultural: `IBM Research at Yorktown Heights in the early 1980s was the world's premier industrial computer-science laboratory, with the budget of a small university and a culture of pure-research-with-an-eye-on-the-product.  Optimizing compilers were strategically critical to IBM because mainframe customers measured systems by throughput per dollar, and a 5% gain in compiled-code performance translated directly into competitive advantage.  Chaitin was also independently famous for his work in algorithmic information theory; the graph-coloring register allocator was, for him, a side project.  Industrial side projects of his caliber became standard textbook material.`,
    citation: 'Chaitin, G. J. (1982). *Register Allocation and Spilling via Graph Coloring.* Proceedings of the 1982 SIGPLAN Symposium on Compiler Construction, 98–105.',
    link: 'https://dl.acm.org/doi/10.1145/800230.806984',
    eli5: `Most programmers never think about register allocation.  The compiler does it.  Variables go in.  Machine code comes out.  Somewhere in the middle the compiler decides which variables get to live in CPU registers — fast, scarce — and which get spilled to memory — slow, abundant.

Chaitin's contribution was to notice that this decision is exactly graph coloring.  Build a graph where every variable is a node.  Connect two nodes if the variables are *alive* at the same time — meaning both might be needed before either is overwritten.  Now ask: can I color this graph using at most k colors, where two connected nodes never share a color?  If yes, you can assign each variable to one of k registers.  If no, you have to spill something.

Graph coloring with three or more colors is NP-complete.  Karp proved it in 1972.  Chaitin's reduction made register allocation NP-complete.  And every compiler in the world has been approximating the answer ever since.  GCC uses a refined Chaitin-Briggs algorithm.  LLVM uses a variant called greedy register allocation.  V8's JIT for JavaScript uses linear scan.  None of them is optimal.  All of them are heuristics that give you a good answer most of the time.

The point of putting this page in the book is the invisibility of the hardness.  Every time you run npm install or cargo build or make, your computer is solving an NP-complete problem in the compiler — and doing it well enough that you do not notice.  The reason it works is forty years of heuristic engineering, not a breakthrough in complexity theory.  The same lesson will repeat in chapter eight (package managers running SAT solvers), chapter eleven (search-based refactoring), and chapter eighteen (CompCert paying the proof tax to get optimal correctness).

The hardness is in the problem.  The compiler is the heuristic.  The heuristic has been good for forty years.  That is not the same as solved.`
  },
  {
    title: 'No Silver Bullet — Essence and Accident',
    year: 1986,
    country: 'US',
    class: 'meta',
    gesture: 'Fred Brooks, 1986 — the hard part of software is the part you cannot automate away.  No tool will deliver an order-of-magnitude improvement in a decade.  None did.',
    body: 'Frederick P. Brooks Jr., at the University of North Carolina, drew the distinction between *essential* and *accidental* complexity in software.  Accidental complexity, he argued, is what comes from the tools and processes — it has been steadily reduced by better languages, libraries, and environments.  Essential complexity is what comes from the problem itself — the inherent intricacy of what the software must do.  Brooks predicted that no single technology, in either tools or management, would deliver an order-of-magnitude improvement in productivity, reliability, or simplicity within a decade, because the remaining work is essential and essential complexity cannot be tooled away.  The prediction has held for forty years.  Brooks named the constraint that this book argues AI does not break: the hard part of software is what the software is *for*, and the next-token predictor does not know what it is for.',
    cultural: `Reagan-era America was watching the personal-computer industry erupt.  IBM had shipped the PC in 1981, Apple was four years past the original Mac, and the software-tool market was suddenly enormous and unregulated.  Brooks had managed OS/360 at IBM in the 1960s — at the time the most expensive software project in history — and his earlier book *The Mythical Man-Month* (1975) was already canonical.  *No Silver Bullet* was published in IEEE Computer the same year that object-oriented programming was being marketed as the imminent revolution.  Brooks was telling the industry, with thirty years of hindsight, that the revolution would not come.  It did not.`,
    citation: 'Brooks, F. P. (1987). *No Silver Bullet — Essence and Accident in Software Engineering.* IEEE Computer, 20(4), 10–19.',
    link: 'https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf',
    eli5: `Brooks made one move and the entire industry has had to reckon with it ever since.

He split the difficulty of software into two piles.  The first pile — *accidental* complexity — is everything that is hard because of the tools, the languages, the environments, the deployment infrastructure, the version-control system, the build process.  The accidental pile shrinks as the field matures.  Compilers got better, so we stopped writing assembly.  Garbage collectors got better, so we stopped managing memory by hand.  Type systems got better, so a class of bugs disappeared.  IDEs got better, so navigating large codebases got cheaper.  All of this is real progress and all of it is accidental complexity going down.

The second pile — *essential* complexity — is everything that is hard because the problem itself is hard.  An accounting system has to handle taxes correctly.  A medical device has to handle patient overdoses correctly.  A scheduling system has to actually schedule.  This pile does not shrink with better tools.  No language, no framework, no IDE, no AI assistant makes the underlying problem simpler.  If the customer wants thirty things, the program must do thirty things, and someone has to figure out what those thirty things are and how they interact.

Brooks predicted that since most of the easy gains in accidental complexity had already been harvested by 1986, no future tool would deliver a tenfold improvement in any decade.  He was right.  Every "this changes everything" technology since — object-oriented programming, agile, the cloud, microservices, DevOps — has produced incremental improvements at best.  The 70% maintenance figure from Lehman has stayed roughly 70%.

This is the constraint AI now faces.  An LLM is a tool.  Tools, by Brooks's argument, can only attack accidental complexity.  AI tools are good at writing the kind of code humans were already writing — boilerplate, glue code, idiomatic patterns.  That is accidental.  What AI does *not* do is figure out what the program is supposed to do, why it is supposed to do that, and how it interacts with everything else in the system.  That is essential.  And essential complexity is the part Lehman's laws say is rising.

The hard part is what the software is for.  No tool fixes that.`
  },
  {
    title: 'An Investigation of the Therac-25 Accidents',
    year: 1993,
    country: ['CA', 'US'],
    class: 'meta',
    gesture: 'Nancy Leveson and Clark Turner, 1993 — six patients dead or maimed by a radiation machine because the software had a race condition the manufacturer believed was impossible.',
    body: 'Between June 1985 and January 1987, the Therac-25 medical linear accelerator, manufactured by Atomic Energy of Canada Limited, delivered massive radiation overdoses to at least six patients.  Three died from the overdoses; others were severely injured.  Nancy Leveson and Clark Turner, at the University of California, Irvine, conducted the definitive post-mortem.  The proximate cause was a race condition in the control software: a flag variable was incremented rather than set, occasionally overflowed to zero, and bypassed safety interlocks when an operator typed quickly enough to hit the timing window.  The deeper cause was that AECL had removed the hardware interlocks present on the Therac-20 and trusted the software to enforce safety alone — without proof, without independent review, and without the discipline Hamilton had named.  Leveson\'s investigation became required reading in every software-safety curriculum.',
    cultural: `Atomic Energy of Canada Limited was a Crown corporation — a government-owned company that designed and exported nuclear reactors and medical accelerators.  In the mid-1980s the FDA's regulation of medical-device software was weak; the agency did not have the technical capacity to audit complex embedded systems.  AECL marketed the Therac-25 as a fully software-controlled successor to the Therac-20 specifically because removing the hardware interlocks lowered the cost.  When the first overdoses occurred, AECL initially blamed operator error and refused to acknowledge software defects.  The industry-wide response — formal certification regimes for medical-device software, the IEC 62304 standard, FDA pre-market software review — was a direct legacy of these six patients.`,
    citation: 'Leveson, N. G. & Turner, C. S. (1993). *An Investigation of the Therac-25 Accidents.* IEEE Computer, 26(7), 18–41.',
    link: 'http://sunnyday.mit.edu/papers/therac.pdf',
    eli5: `The Therac-25 was a radiation therapy machine.  Patients with cancer would lie on a table and the machine would deliver a precisely calibrated dose of radiation to a tumor.  In low-energy mode it used an electron beam directly.  In high-energy mode it used a stronger electron beam pointed at a metal target to produce X-rays — but the metal target had to be physically rotated into place, because if the high-energy beam hit a patient without the target it would deliver, instead of a therapeutic dose, an instant lethal dose.

The earlier Therac-20 had a hardware interlock that physically prevented the machine from firing the high-energy beam when the target was not in place.  The Therac-25 removed the hardware interlock and replaced it with a software check.  AECL believed the software would be safe.  They were wrong.

The bug was small.  The control software used a flag variable to track machine state.  The variable was incremented on each setup pass.  Most of the time this worked.  But the variable was a single byte, and on roughly one pass in two hundred and fifty-six it overflowed back to zero — and zero meant "okay to fire."  If an operator was experienced enough to type the setup commands faster than the machine could fully react, they could hit the timing window where the flag had overflowed but the target was not in place.  The machine would fire.  The patient would receive between fifty and a hundred times the prescribed dose.

Six patients.  Three deaths.  And a generation of software safety engineers shaped by this case.

The lesson is the one this book keeps returning to.  Hoare's triples make safety provable.  Hamilton's discipline makes safety routine.  Skip both, and you get the Therac-25.  The patients were not killed by an exotic flaw.  They were killed by an integer overflow that any formal-methods discipline would have caught — that any proof obligation on the precondition "high-energy mode implies target in place" would have flagged before the machine ever shipped.

Six patients.  One race condition.  The cost of skipping the discipline.`
  },
  {
    title: 'Test Suite Minimization',
    year: 1993,
    country: 'US',
    class: 'NP-complete',
    gesture: 'Mary Jean Harrold, Rajiv Gupta, Mary Lou Soffa, 1993 — selecting the smallest test suite that still covers all the things you care about is NP-complete.  Reduces to set cover.',
    body: 'Mary Jean Harrold (Clemson), Rajiv Gupta (Pittsburgh), and Mary Lou Soffa (Pittsburgh) gave the formal definition of the test suite minimization problem and proved it NP-complete by reduction from minimum set cover.  Given a test suite T and a set of testing requirements R, find the smallest subset T\' ⊆ T such that every requirement in R is satisfied by at least one test in T\'.  Each test "covers" some requirements; you want minimum number of tests that cover all requirements; this is set cover, exactly.  Set cover was on Karp\'s 1972 list.  Their paper introduced the HGS heuristic — a greedy algorithm that runs in polynomial time and gives a logarithmic approximation.  Every modern test-reduction tool descends from this paper.  The hardness is unavoidable; only the heuristic varies.',
    cultural: `Early-1990s American academic software engineering was still a small field, dominated by a few research groups at universities and a handful of industrial labs.  Software-testing research was particularly under-funded compared to programming-languages or operating-systems work, partly because testing was considered an applied rather than fundamental discipline.  Harrold, Gupta, and Soffa came out of the program-analysis tradition that linked testing rigorously to compiler theory.  Their formalization gave the field its first complexity-theoretic foothold and established a research program that continues today.`,
    citation: 'Harrold, M. J., Gupta, R., Soffa, M. L. (1993). *A Methodology for Controlling the Size of a Test Suite.* ACM Transactions on Software Engineering and Methodology, 2(3), 270–285.',
    link: 'https://dl.acm.org/doi/10.1145/152388.152391',
    eli5: `A large software project accumulates tests the way a forest accumulates leaves.  Every bug fix adds a regression test.  Every feature adds an acceptance test.  Every refactor adds a contract test.  After a few years, running the entire suite takes hours.  Every team eventually faces the same question: which tests can we cut and still know we have not regressed?

The formal version is sharper.  Each test exercises some set of *requirements* — lines of code, branches, mutations, business rules.  You want the smallest subset of tests that still exercises every requirement at least once.  Pick too few and you stop catching bugs.  Pick too many and you pay the time cost.  The sweet spot is a minimum cover.

Harrold, Gupta, and Soffa proved this is the *set cover* problem in disguise.  Set cover was one of Karp's original twenty-one NP-complete problems.  So test suite minimization, exactly, is NP-complete.  No tool, no AI, no heuristic will solve it optimally on real codebases — the search space is too large.

Their paper did the next best thing.  It gave a *greedy* heuristic — pick the test that covers the most uncovered requirements, mark those requirements covered, repeat — and proved that greedy gives you a logarithmic approximation: at worst, ln(n) times the optimum.  This is the same approximation ratio as the classic greedy set cover algorithm, and it is the best you can hope for unless P = NP.

Every test-reduction tool you have ever used — Bazel test selection, Pytest sharding, every commercial regression-test optimizer — is running a variant of HGS or a refinement of it.  The shape has not changed in thirty years because the underlying complexity has not changed.  And the underlying complexity is not going to change, because Karp drew the floor in 1972 and that is where we live.

Pick which tests to keep.  NP-complete.  Greedy heuristic since 1993.`
  },
  {
    title: 'Bunch — Software Module Clustering',
    year: 1998,
    country: 'US',
    class: 'NP-hard',
    gesture: 'Spiros Mancoridis and Brian Mitchell, 1998 — recovering the right modular structure of a codebase reduces to graph partitioning, which is NP-hard.  Architecture is search.',
    body: 'Spiros Mancoridis and Brian Mitchell, at Drexel University, with Yih-Farn Chen and Emden Gansner, defined the software module clustering problem and built the *Bunch* tool to solve it heuristically.  Given a module dependency graph — nodes are source files, edges are calls or imports — find a partition of the nodes into clusters that maximizes a *modularization quality* (MQ) metric: high cohesion within clusters, low coupling between them.  This is graph partitioning, NP-hard.  Bunch attacks it with hill-climbing and genetic algorithms; later work added simulated annealing and multi-objective Pareto search.  Every empirical study confirms the same: optimal modularization is computationally infeasible at industrial scale, and every architectural-recovery tool delivers approximations.  The hardness is intrinsic.  Choosing where the modules go is a search problem, not an engineering one.',
    cultural: `Late-1990s American software was in the middle of the dot-com expansion.  Java had been released three years earlier; enterprise codebases were growing at unprecedented rates as the web pulled corporate IT into the public-facing internet.  The architectural-recovery problem — figuring out, after the fact, what the modular structure of a large codebase was supposed to be — became commercially relevant for the first time.  Drexel's research group was one of a handful working on this problem, and Bunch became the de facto reference implementation cited by every later tool.`,
    citation: 'Mancoridis, S., Mitchell, B. S., Rorres, C., Chen, Y., Gansner, E. R. (1998). *Using Automatic Clustering to Produce High-Level System Organizations of Source Code.* Proceedings of the 6th International Workshop on Program Comprehension, 45–52.',
    link: 'https://www.cs.drexel.edu/~mancors/papers/JSS04.pdf',
    eli5: `When a project is small, the right module structure is obvious.  Two files.  Three files.  You can hold the whole thing in your head.  When a project gets to ten thousand files, the right module structure is not obvious.  It is a research question.

Mancoridis and Mitchell gave the research question its formal name.  The dependency graph of a codebase has source files as nodes and dependencies as edges.  A modular architecture is a partition of that graph — every file belongs to exactly one module, and the module boundaries should follow the natural seams of the dependency structure.  Files that talk to each other a lot belong in the same module (high *cohesion*).  Modules should not talk to each other unnecessarily (low *coupling*).  The Modularization Quality metric MQ formalizes this trade-off.

Maximizing MQ over all possible partitions of a graph is graph partitioning.  Graph partitioning is NP-hard.  This means that for any real codebase, there is no algorithm that finds the truly optimal modular structure — the search space is too large.  Bunch sidesteps the hardness with hill-climbing and genetic algorithms.  You start with a random partition, swap files between modules looking for improvements, and stop when no swap helps anymore.  The result is a *local* optimum, not a global one.

Every modern architectural-recovery tool — every "your codebase is divided into these modules" report from a static analyzer or a refactoring assistant — is solving the same NP-hard problem with a heuristic.  This is the second time in the book the same pattern appears: a real engineering activity (deciding where the modules go) turns out to be a known-hard combinatorial problem (graph partitioning), and the tools are heuristics.  The next chapter is the third time, with package dependencies.

When AI tools claim to "refactor" a codebase or "improve its architecture," they are running an even less rigorous heuristic than Bunch.  They have no MQ metric, no convergence guarantee, no guarantee of even local optimum.  They are predicting the next token from context.  That is a worse search procedure than hill climbing for an NP-hard problem.

Where do the modules go.  NP-hard.  Architecture is search.`
  },
  {
    title: 'Package Dependency Resolution as 3-SAT',
    year: 2005,
    country: 'FR',
    class: 'NP-complete',
    gesture: 'Roberto Di Cosmo et al., 2005 — installing a set of compatible packages is NP-complete.  Every modern package manager is a SAT solver in disguise.',
    body: 'Roberto Di Cosmo, at the University of Paris Diderot, with collaborators on the EU-funded EDOS project, formally proved that the package installation problem in real-world Linux distributions is NP-complete.  Given a repository of packages with version constraints, dependencies, and conflicts, decide whether a given set of user-selected packages can be installed simultaneously.  Di Cosmo encoded the problem as 3-SAT for both the Debian (.deb) and Red Hat (.rpm) constraint languages, with reductions tight enough that real package managers were observed to time out on adversarial inputs.  The result reshaped the architecture of every major package manager.  OpenSUSE\'s libsolv (used by zypper, dnf, microdnf), Fedora\'s dnf, the original libapt — all run a SAT solver internally.  Apt uses a heuristic scoring approach, which is why it occasionally proposes removing your desktop environment.  npm and Cargo make pragmatic compromises that avoid SAT but accept incompatible-version trees.',
    cultural: `Mid-2000s France was investing in academic open-source research at scale, partly as European pushback against US dominance of the software industry.  Debian and the broader Linux distribution ecosystem were maturing into the infrastructure of the modern internet.  The EU-funded EDOS project (Environment for the Development and Distribution of Open Source software) was the political vehicle for the work.  Di Cosmo combined formal verification expertise with practical Debian-developer experience — a rare combination — and the result was the first proof of NP-completeness for an everyday system tool.  The architecture of package managers has been shaped by this paper ever since.`,
    citation: 'Mancinelli, F., Boender, J., Di Cosmo, R., Vouillon, J., Durak, B., Leroy, X., Treinen, R. (2006). *Managing the Complexity of Large Free and Open Source Package-Based Software Distributions.* Proceedings of the 21st IEEE/ACM International Conference on Automated Software Engineering, 199–208.',
    link: 'https://hal.science/hal-00149566/document',
    eli5: `Most developers think of package management as boring infrastructure.  You type apt install or npm install and the right thing happens.  Sometimes the wrong thing happens — a package gets removed that you wanted, or a version conflict makes the install fail.  When that happens you blame the tool.

The tool is doing the best it can with an NP-complete problem.

A real package repository is a giant constraint satisfaction problem.  Every package declares dependencies (I need libfoo ≥ 2.1) and conflicts (I cannot coexist with libfoo < 2.0 or libbar 3.x).  When you ask for a set of packages to be installed, the package manager has to find a complete *assignment* — a specific version of every transitive dependency — that satisfies all the constraints simultaneously.  Di Cosmo's reduction shows this is exactly 3-SAT.

This is not theoretical.  In 2005 Di Cosmo and colleagues constructed real Debian package configurations that caused dpkg to spend minutes — sometimes hours — looking for a satisfying assignment.  And these were not adversarial inputs cooked up in a lab.  They were real-world repositories at the scale Debian was already operating.

The response was architectural.  OpenSUSE built libsolv, an actual SAT solver inside the package manager.  Fedora's dnf uses libsolv.  The Maven dependency mediator switched to SAT.  Eclipse's P2 update manager runs a SAT solver internally.  When you install software on a modern Linux system, you are running a 3-SAT solver and you do not know it.

Apt took the other path.  Apt does not run a real SAT solver — it runs a greedy scoring heuristic that picks the first satisfying assignment it finds.  This is why apt occasionally suggests "the following packages will be REMOVED" with a list that includes half your desktop.  The scoring heuristic gave up and proposed an extreme solution because the problem was, in that instance, hard.

npm v7+ and Cargo make a different compromise.  Instead of finding one global assignment, they let *different* parts of the dependency tree have *different* versions of the same package.  This avoids the SAT problem entirely by relaxing the constraints — but at the cost of pulling multiple versions of the same library into your build.  This is the reason node_modules is enormous.

Every time you install a package, you are running an NP-complete problem.  The problem has not gotten easier in twenty years.  Only the heuristics have.

Your package manager is a SAT solver.  It has to be.`
  },
  {
    title: 'The Power of 10 — Rules for Safety-Critical Code',
    year: 2006,
    country: 'US',
    class: 'meta',
    gesture: 'Gerard Holzmann, NASA/JPL, 2006 — ten coding rules that make C statically analyzable.  Discipline as gravity.',
    body: 'Gerard Holzmann, at the NASA Jet Propulsion Laboratory Laboratory for Reliable Software, distilled four decades of safety-critical software experience into ten coding rules for C.  Restrict control flow to simple constructs (no goto, no recursion, no setjmp/longjmp).  Bound every loop with a fixed upper limit a static analyzer can verify.  No dynamic memory allocation after initialization.  No function longer than a single printed page.  At least two assertions per function.  Restrict scope of data to the smallest reasonable.  Check return values of all non-void functions or explicitly cast to void.  Limit preprocessor use.  Restrict pointer indirection to one level; no function pointers.  Compile with all warnings enabled, treat as errors, run multiple static analyzers.  The rules are restrictive enough that any C program following them is amenable to formal analysis, and lax enough that real flight software is written in them.  The rules of the road for code that flies.',
    cultural: `NASA after the Columbia disaster of 2003 was rebuilding its software safety culture.  The shuttle had been lost on re-entry due to a foam strike during launch — not a software failure, but the post-mortem reopened questions about what software safety meant across the agency.  JPL was operating Spirit and Opportunity on Mars, both already past their planned missions.  Holzmann, who had also developed the SPIN model checker at Bell Labs, was at JPL's Laboratory for Reliable Software with a mandate to make safety-critical coding teachable.  The Power of 10 was the result — a checklist short enough to memorize, restrictive enough to mean something, adopted by the agency and exported far beyond it.`,
    citation: 'Holzmann, G. J. (2006). *The Power of 10: Rules for Developing Safety-Critical Code.* IEEE Computer, 39(6), 95–99.',
    link: 'https://web.eecs.umich.edu/~imarkov/10rules.pdf',
    eli5: `Holzmann had spent decades writing code that flew — Voyager, Cassini, Mars rovers.  In 2006 he wrote down what he had learned, and the answer is almost laughably blunt: most of the rules are restrictions on what you are allowed to do.

No goto.  No recursion.  No dynamic allocation after the program starts.  Every loop must have a bound the compiler can prove.  Every function must fit on one printed page.  Every non-void return value must be checked.  All warnings must be enabled and treated as errors.  Every function must contain at least two assertions.

These rules look austere.  They are.  They forbid most of the techniques that make modern software development convenient.  No malloc-as-needed.  No clever recursive descent.  No throw-and-catch.  No "we'll just bound this loop dynamically."  The rules are designed so that any program written in their style can be statically analyzed end-to-end — meaning a tool can prove, before the program ever runs, that it has no buffer overflows, no use-after-free, no infinite loops, no dereferences of NULL.

This is the discipline Hoare's logic enables, made into a checklist.  The Power of 10 is not the deepest formal-methods technique in this book — that distinction belongs to seL4 in chapter eighteen and CompCert in chapter seventeen.  But it is the most *adoptable*.  A team that cannot afford full formal verification can adopt the Power of 10 in an afternoon.  A code review that follows these rules will catch most of the bugs that take down embedded systems.

These rules are why the Mars rovers do not crash.  They are why the SpaceX flight software does not crash.  They are why Boeing's avionics work — when they are written under DO-178C, which incorporates these constraints — and why the 737 MAX MCAS system, which was not written under that discipline, did not.

The rest of the industry has the opposite culture.  Use any pattern, any library, any abstraction; let the runtime handle it; iterate fast.  The opposite culture works fine for software whose worst case is a refunded subscription.  It does not work for software whose worst case is a fatal overdose, a crashed plane, or a satellite lost in transit.  And as AI tools push the cost of writing "any pattern, any library" toward zero, they push the rest of the industry further from this discipline, not closer.

Ten rules.  Mars.  Discipline as gravity.`
  },
  {
    title: 'CompCert — A Formally Verified C Compiler',
    year: 2009,
    country: 'FR',
    class: 'meta',
    gesture: 'Xavier Leroy, INRIA, 2009 — a C compiler whose correctness is mechanically proved in Coq.  100,000 lines of proof for ~10,000 lines of compiler.  The proof tax made visible.',
    body: 'Xavier Leroy, at INRIA Rocquencourt, led the development of CompCert — a moderately optimizing C compiler whose semantic preservation property is formally proved in the Coq proof assistant.  The proof guarantees that any safety property holding of the source program also holds of the compiled assembly: no compiler bug can introduce a vulnerability that was not already present in the source.  Targets PowerPC, ARM, x86, and RISC-V.  Subset of C is *Clight*, a large fragment.  The proof is roughly 100,000 lines of Coq for a compiler of roughly 10,000 lines of code, representing approximately six person-years of effort.  CompCert is now used commercially in safety-critical certification, especially for software targeting DO-178C Level A.  The point is not that the compiler is fast (it is competitive but not the fastest); the point is that, alone among production C compilers, it does not have miscompilation bugs.',
    cultural: `France in the late 2000s was the world center of formal-methods research, anchored by INRIA's long-standing investment in the Coq proof assistant (developed there since 1984) and the Caml/OCaml language family.  The French academic system, with its explicit support for long-horizon foundational research, had given Leroy and his collaborators twenty years to build the tools.  Aviation safety was a strategic concern: Airbus and Dassault, both French, were major employers of formal-methods specialists.  CompCert moved into commercial use through AbsInt, a German company, exactly the kind of European industrial-academic collaboration that would have been hard to fund in the US.`,
    citation: 'Leroy, X. (2009). *Formal Verification of a Realistic Compiler.* Communications of the ACM, 52(7), 107–115.',
    link: 'https://xavierleroy.org/publi/compcert-CACM.pdf',
    eli5: `Most compilers have miscompilation bugs.  This is one of the dirty secrets of systems software.  Csmith — a randomized C-program generator — finds dozens of latent miscompilation bugs in GCC and Clang every year by feeding them random programs and comparing outputs across versions.  These are bugs where the source code has one meaning and the compiler emits assembly with a different meaning.  Most of them are caught before they ship.  Some are not.  When a critical bug ends up in production, the patch goes out and the world moves on.

This is fine for ordinary software.  It is not fine for software that flies airplanes, drives medical devices, or controls nuclear reactors.  For those domains, an undetected miscompilation could kill people.  And it has — Therac-25 was not a miscompilation, but the lesson is the same: software that has not been proven correct cannot be assumed correct, and ad-hoc testing is not proof.

CompCert is the answer.  Xavier Leroy and his collaborators wrote a C compiler in Coq, and along with the compiler they wrote a *proof* — a hundred thousand lines of mechanically checked argument — that the compiler cannot miscompile.  The proof is of a property called *semantic preservation*: for every input C program, the assembly the compiler emits behaves exactly as the C program is specified to behave.  Not "almost exactly."  Not "with high probability."  Exactly.  The proof is checked by Coq — a small kernel of trusted code, an order of magnitude smaller than the compiler itself — and if the proof checks, the compiler is correct.

The cost was six person-years for ten thousand lines of compiler.  That is ten times the engineering effort of building an unverified compiler of comparable scope.  And CompCert is not as aggressive an optimizer as GCC at -O3 — though it is competitive at -O1.  This is the *proof tax*.  You pay it in years.  You get back software that does not lie.

CompCert is now sold commercially by AbsInt.  It is used to compile flight-control software for civil aviation under DO-178C Level A — the highest assurance level, where a software failure can cause loss of life.  In that domain, the proof tax is worth it.  In most domains it is not.  And that is the asymmetry the rest of the book turns on: when human life is at risk, the industry knows how to write software that does not degrade.  When it is not, the industry does not bother.

100,000 lines of proof.  One compiler that does not lie.`
  },
  {
    title: 'seL4 — Formal Verification of an OS Kernel',
    year: 2009,
    country: 'AU',
    class: 'meta',
    gesture: 'Gerwin Klein et al., NICTA, 2009 — first formally verified general-purpose OS microkernel.  ~10,000 lines of C, verified down to assembly.  About twenty-five person-years of proof.',
    body: 'Gerwin Klein, Kevin Elphinstone, Gernot Heiser, and a team at NICTA in Sydney delivered the first machine-checked correctness proof of a general-purpose operating-system microkernel.  seL4 is approximately 10,000 lines of C, verified using the Isabelle/HOL theorem prover via two large refinement steps: an abstract specification refined to an executable Haskell prototype, refined to the C implementation, ultimately related to the compiled binary.  The proof establishes functional correctness: the kernel never violates its specification, never crashes, never violates memory safety, and enforces the access-control properties it claims.  Effort: roughly twenty-five person-years of proof for ten thousand lines of code, a ratio of roughly 200,000 lines of proof per 10,000 lines of code.  seL4 now ships in safety-critical and security-critical systems including military aviation and autonomous-vehicle platforms.  Existence proof: a real OS kernel can be proved correct.',
    cultural: `Australia in the 2000s built NICTA — the National ICT Australia research center — as a deliberate national investment in computer-science research, modeled on European institutes like INRIA.  Sydney's UNSW was its anchor.  The seL4 project was specifically positioned as the achievement that would justify NICTA's existence: a result no American or European group had produced, delivered by an Australian-led team.  The post-9/11 security climate had made formally verified kernels strategically interesting to the US Department of Defense, and the DARPA HACMS program later funded seL4 deployments in autonomous helicopters.  The science was Australian; the funding flow that proved its value was largely American.`,
    citation: 'Klein, G., Elphinstone, K., Heiser, G., Andronick, J., Cock, D., Derrin, P., Elkaduwe, D., Engelhardt, K., Kolanski, R., Norrish, M., Sewell, T., Tuch, H., Winwood, S. (2009). *seL4: Formal Verification of an OS Kernel.* Proceedings of the 22nd ACM SIGOPS Symposium on Operating Systems Principles, 207–220.',
    link: 'https://www.sigops.org/s/conferences/sosp/2009/papers/klein-sosp09.pdf',
    eli5: `An operating-system kernel is the part of the system that everything else trusts.  When the kernel has a bug, every program running on top of it inherits the bug.  Every modern OS kernel — Linux, Windows NT, Darwin — has thousands of CVEs filed against it over its lifetime.  This is normal.  Kernels are large, complex, written in C, and impossible to fully test.

seL4 is not normal.  It is the first general-purpose OS microkernel to be *proved* correct, in the formal sense — meaning a mathematical proof, mechanically checked, that the kernel meets its specification.  Not "we tested it a lot and it seems to work."  A proof.

The team at NICTA in Sydney spent roughly twenty-five person-years on this.  The kernel itself is about ten thousand lines of C.  The proof is about two hundred thousand lines of Isabelle/HOL.  Twenty lines of proof per line of code.  That is the cost.

What does the proof guarantee?  Functional correctness — the kernel never deviates from its specification.  Memory safety — no buffer overflows, no use-after-free, no NULL dereferences, ever.  Termination of every kernel call.  Information-flow security — no covert channels between processes.  The proof goes from the abstract specification, through a Haskell-like executable specification, through the C implementation, to the compiled assembly.  Every step is mechanically related.  If a bug existed in the kernel, the proof would not check.

seL4 ships today in real systems.  Boeing uses it in autonomous-vehicle platforms.  Lockheed uses it in military aviation.  The HACMS program (DARPA, mid-2010s) used seL4 in an unmanned helicopter and red-teamed it against attackers — the attackers could not break out of seL4-isolated processes even with full knowledge of the source.

The lesson is the same as CompCert.  We *can* write software that does not degrade.  The technology exists.  Hoare gave us the language.  Coq and Isabelle give us the checkers.  CompCert and seL4 are the existence proofs at the size of real systems.  What we cannot do is afford to do this for *all* software.  The proof tax is too high for software whose failures are inconvenient rather than fatal.

This is the asymmetry the AI era is making worse.  AI tools push the cost of writing untrusted code toward zero.  They do not push the cost of *proving* code toward zero.  They make the cheap path cheaper and leave the expensive path expensive.  The gap widens.

Twenty-five person-years.  Ten thousand lines.  The price of trust.`
  },
  {
    title: 'Do Users Write More Insecure Code with AI Assistants?',
    year: 2023,
    country: 'US',
    class: 'meta',
    gesture: 'Neil Perry, Megha Srivastava, Deepak Kumar, Dan Boneh — Stanford, CCS 2023 — yes, and they believe the opposite.  The illusion is the danger.',
    body: 'Neil Perry, Megha Srivastava, Deepak Kumar, and Dan Boneh, at Stanford, ran the first large-scale controlled study of security outcomes when programmers use AI coding assistants.  Forty-seven participants completed five security-relevant programming tasks across Python, C, and JavaScript, with random assignment between AI-assistant access (OpenAI codex-davinci-002) and a control group.  Result: participants with AI access wrote *significantly less secure* code across the majority of tasks.  Worse, they were also *more likely to believe* their code was secure than the control group.  Participants who engaged more critically with their prompts — re-phrasing, adjusting, questioning the suggestions — produced safer code than those who accepted suggestions verbatim.  Published at CCS \'23, the flagship academic security conference.  The first peer-reviewed evidence that AI coding tools degrade the global property humans most need to preserve under change: security.',
    cultural: `Late 2022 to late 2023 was the first full year of public-facing generative AI.  ChatGPT had launched in November 2022.  GitHub Copilot, public since June 2022, was being rolled out to enterprise customers.  Industry rhetoric framed AI coding tools as straightforwardly productive.  Stanford's Boneh group — known for cryptographic research — was unusual in subjecting the claim to controlled experiment rather than survey.  CCS, the flagship academic computer-security conference, was the appropriate venue and the timing was deliberate: the paper was the first major peer-reviewed pushback against the industry narrative, published while the narrative was at its loudest.`,
    citation: 'Perry, N., Srivastava, M., Kumar, D., Boneh, D. (2023). *Do Users Write More Insecure Code with AI Assistants?* Proceedings of the 2023 ACM SIGSAC Conference on Computer and Communications Security, 2785–2799.',
    link: 'https://arxiv.org/abs/2211.03622',
    eli5: `The Stanford team set up a controlled study.  Forty-seven programmers.  Five security-relevant tasks across three languages.  Half the participants got an AI assistant — Codex, the model that powered the original GitHub Copilot.  The other half got nothing but their editor.  All other variables held constant.

The result was not subtle.  Across the majority of tasks, the AI-assisted group wrote less secure code.  More buffer overflows.  More SQL injections.  More authentication bypasses.  More misuse of cryptographic libraries.  This was measurable, statistically significant, and consistent across languages.

The second result was worse.  When asked, the AI-assisted group also reported *higher confidence* that their code was secure.  They were producing more vulnerable code while feeling better about it.  This is the inversion that should have ended the conversation about AI as a security tool — the worst possible combination is "your code is more vulnerable AND you trust it more."

The third result is the one that points the way forward.  Within the AI-assisted group, participants varied in *how* they used the AI.  Some accepted suggestions wholesale.  Some engaged critically — re-phrasing prompts, comparing alternatives, questioning the model's claims.  The critical-engagement subset produced safer code than the wholesale-acceptance subset, and roughly as safe as the control group.

The lesson is sharper than "AI is bad at security."  The lesson is about the *epistemics* of code authorship.  When you write code yourself, you have a calibrated sense of what you understand and what you do not.  When you accept code from an AI, you import the AI's confidence along with the code — and the AI is confident about everything, because the model has no calibrated uncertainty.  The user fills in the missing calibration with their own confidence in the model.  The code becomes harder to review because the author is not present to be questioned.

This is the empirical leading edge of the book's thesis.  Software maintenance is the work of preserving global invariants under change.  Security is one of those invariants — perhaps the load-bearing one.  AI tools push local productivity up and global invariant preservation down, *and* push the user's confidence in the result up.  The Stanford study is the first peer-reviewed measurement of this trade and the first to quantify the confidence-vulnerability inversion.

The illusion is the danger.  Confidence inversely proportional to safety.`
  },
  {
    title: 'Coding on Copilot — Downward Pressure on Code Quality',
    year: 2024,
    country: 'US',
    class: 'meta',
    gesture: 'Bill Harding, GitClear, January 2024 — analyzed 153 million lines of code.  Code churn doubling.  AI-era code resembles an itinerant contributor.',
    body: 'Bill Harding, founder of GitClear, published the first large-scale empirical analysis of code-quality trends across the Copilot adoption period.  GitClear instrumented 153 million lines of changed code from 2020 through 2023, distinguishing among *added*, *deleted*, *updated*, *moved*, and *copy-pasted* lines, and tracking *churn* — the percentage of authored lines reverted or rewritten within two weeks.  Findings: churn projected to double by 2024 versus the 2021 pre-AI baseline; ratio of added and copy-pasted code rising; ratio of updated, moved, and deleted code falling.  Harding\'s framing: AI-era code resembles "an itinerant contributor" — someone who shows up, adds material, never refactors, and leaves.  The 2025 follow-up (GitClear, 211 million lines analyzed) reported an eight-fold year-over-year increase in five-line-or-more duplicate code blocks.  First industry-scale measurement of the maintenance-side cost of AI coding tools.',
    cultural: `Post-pandemic American software was deep into the AI productivity narrative.  GitHub Copilot had been generally available for a year and a half; major employers were adopting it as a default.  Industry self-reports were uniformly positive.  GitClear was a small Seattle company whose business — granular code-change analytics — gave it instrumentation that nobody else had.  Harding's report dropped into a discourse that had not been challenged with hard data, and it was widely cited within weeks.  The 2025 follow-up sharpened the result with a year more of data and confirmed the trajectory.`,
    citation: 'Harding, W. & Kloster, M. (2024). *Coding on Copilot: 2023 Data Suggests Downward Pressure on Code Quality.* GitClear Research Report.  Follow-up: Harding, W. (2025). *AI Copilot Code Quality: 2024 Data Suggests 4× Growth in Code Clones.* GitClear Research Report.',
    link: 'https://www.gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality',
    eli5: `Most claims about AI productivity are based on developer self-reports.  Surveys.  "Did you feel faster this week?"  These are unreliable for the same reason all self-reports are unreliable — people remember the wins and forget the losses, and they want to like the tools their employer paid for.  GitClear did not run a survey.  GitClear measured what the code did.

The instrumentation is the interesting part.  Most code-metrics tools count lines.  GitClear classifies *change types*.  When you commit a line, did you write it from scratch (added)?  Did you tweak an existing line (updated)?  Did you move a chunk of logic from one file to another without changing it (moved)?  Did you delete it?  Did you copy it from somewhere else in the codebase (copy-pasted)?  Each category tells a different story about the engineering activity behind the commit.

Healthy codebases have a mix.  Updates and moves dominate over time, because mature systems mostly evolve their existing structure rather than bolting on new structure.  Deleted code is a sign of refactoring — the team is removing things that are no longer needed.  Added and copy-pasted code rising relative to updated and moved code is a warning sign: the team is bolting on instead of integrating.

GitClear's finding, across 153 million lines and four years of data, is that the warning sign is now lit.  The Copilot-era ratio shifted decisively toward added and copy-pasted, decisively away from updated, moved, and deleted.  The team is not refactoring.  The team is accreting.  And the *churn* number — lines that are reverted or substantially rewritten within two weeks of being committed — is rising fast.  Churn is the empirical signature of code that was wrong on first commit and had to be redone.

The 2025 follow-up sharpened the result.  Five-line-or-more duplicate blocks grew *eight-fold* year over year.  Not eight percent.  Eight times.  The DRY principle, which has been the load-bearing axiom of software engineering for fifty years, is being violated at industrial scale.  And the violations are happening because the AI tool, on each call, regenerates code from scratch with no awareness of what already exists in the codebase.  Each call is an itinerant contributor.

This is the Lehman entropy result of chapter nine, observed empirically in 2024.  Software degrades unless explicit work is done to reduce its complexity.  AI tools are doing the opposite of that work.  They are adding faster than they are integrating.  And the maintenance bill compounds.

Add code.  Do not refactor.  The itinerant contributor signs every commit.`
  },
  {
    title: '2024 DORA Accelerate State of DevOps Report',
    year: 2024,
    country: 'US',
    class: 'meta',
    gesture: 'Google Cloud, October 2024 — a 25% rise in AI adoption associates with a 7.2% drop in delivery stability.  The trade is now visible at industry scale.',
    body: 'The 2024 Accelerate State of DevOps Report, published by Google Cloud and the DORA research team, surveyed approximately 39,000 software professionals worldwide.  The headline finding: every 25% increase in self-reported AI tool adoption was associated with an estimated 1.5% decrease in software delivery throughput and a 7.2% decrease in software delivery stability — even as developers reported a 2.1% increase in productivity and 2.6% increase in job satisfaction over the same lift.  39% of respondents reported "little to no trust" in AI-generated code.  The report explicitly frames this as a stability cost: AI accelerates work that would have happened anyway, but the quality cost shows up in the systems where the work lands.  Industry-scale corroboration of the GitClear and Stanford findings, in the most-cited annual measurement of software-delivery health.',
    cultural: `Google in 2024 was internally betting heavily on AI as the engine of the next decade of growth, while running the most-cited measurement of software-delivery health on the planet.  The DORA program — originally led by Nicole Forsgren before its acquisition by Google — had a methodology hardened by a decade of annual reports and a research team accustomed to publishing what the data showed.  The 2024 report's AI findings were reported alongside marketing claims of AI productivity — an internal tension visible in the document itself.  The methodology is rigorous; the framing is corporate.  The reader is left to weigh both.`,
    citation: 'DORA Research Team & Google Cloud (2024). *2024 Accelerate State of DevOps Report: Impact of Generative AI in Software Development.* Google Cloud.',
    link: 'https://dora.dev/research/2024/dora-report/',
    eli5: `DORA is the longest-running and most-cited measurement of how software organizations actually perform.  Started by Nicole Forsgren, Jez Humble, and Gene Kim in the early 2010s, the annual State of DevOps report surveys tens of thousands of software professionals on a small set of well-validated outcome metrics: how often do you deploy, how long does it take a change to reach production, what fraction of changes cause failures, how long does it take to recover from a failure.  These are the metrics that distinguish high-performing teams from low-performing ones, and they have been measured consistently for a decade.

The 2024 report was the first to seriously study AI tooling.  The result was the most carefully measured, statistically defensible version of what GitClear had observed and what the Stanford CCS study had found in the lab.  At industry scale, more AI use is associated with more stability problems.

The numbers are worth memorizing.  A 25% rise in AI adoption — meaning a quarter of the team starting to use AI tools who was not using them before — is associated with a 1.5% drop in delivery throughput and a 7.2% drop in delivery stability.  Throughput is roughly how fast changes ship.  Stability is roughly how often shipped changes break things.  Throughput moving slightly down is notable.  Stability moving down 7.2% is the signal.

Why the asymmetry?  Because writing new code is a local activity, and AI is good at it.  *Stable delivery* is a global activity — it depends on the new code interacting cleanly with everything that already exists, on regression tests catching problems, on rollbacks working when they have to.  AI tools accelerate the local part.  They do nothing to help the global part.  The result is faster commits with more incidents downstream.

The 39% "little to no trust" figure is the other one to remember.  Even among teams that are using these tools, the developers themselves are reporting that they do not fully trust the output.  This is the *opposite* of what the Stanford study found in the lab — but the Stanford finding was about *security* tasks, where users overestimated their AI-assisted work.  The DORA finding is about *general* trust, and is properly skeptical.  The combined picture: developers report distrust on average, but in specific high-stakes contexts they trust the tool more than they should.

DORA is the keystone of the empirical case.  It is the cross-industry measurement that connects the laboratory results (Stanford) to the codebase-instrumentation results (GitClear) and to the per-developer time-cost measurement (METR, next chapter).  The trade is real.  The trade is measured.  The trade is being made anyway.

Throughput slightly up.  Stability down 7.2%.  The trade is visible.`
  },
  {
    title: 'Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity',
    year: 2025,
    country: 'US',
    class: 'meta',
    gesture: 'METR, July 2025 — randomized trial.  Developers were 19% slower with AI tools.  They believed they were 20% faster.  The instruments are lying.',
    body: 'METR (Model Evaluation and Threat Research) ran the first rigorous randomized controlled trial of AI tooling on real software-engineering work.  Sixteen experienced open-source developers, with an average of five years on their own repositories, completed 246 randomly assigned tasks under two conditions: AI-allowed (Cursor Pro with Claude 3.5/3.7 Sonnet) and AI-forbidden.  Result: developers using AI took 19% longer to complete tasks (95% CI: +2% to +39%), reversing the predicted speedup.  Critically, developers self-reported a 20% speedup from AI, and outside experts (economists predicted 39% speedup; ML researchers predicted 38%) were also wrong in the same direction.  The first measurement that separates *perceived* productivity from *measured* productivity in this domain.  AI does not slow down all developers — it slows down experienced developers working on familiar codebases, exactly where global-invariant maintenance is most concentrated.',
    cultural: `METR is one of a small set of post-2023 nonprofits formed specifically to evaluate frontier AI capabilities and risks empirically.  Funding mostly comes from AI-safety-aligned philanthropy.  By mid-2025 the public discourse around AI productivity had become saturated with self-report and benchmark numbers; controlled experiments on real work were rare.  METR's study was published into a discourse where the dominant priors — set by economists and ML researchers — pointed sharply in the opposite direction of the result.  The methodological care of the study made it hard to dismiss; the result became one of the most-cited empirical findings of the year.`,
    citation: 'METR (2025). *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity.* arXiv:2507.09089.',
    link: 'https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/',
    eli5: `Up to this point in the book the empirical evidence has been observational.  GitClear measures what the code did.  DORA measures what the teams reported.  Stanford measured outcomes on synthetic security tasks.  Each one is real evidence.  None is a randomized controlled trial.

METR ran the trial.  Sixteen developers, all experienced — five years on average on the open-source projects they work on.  They had 246 real tasks from their own backlogs.  Each task was randomly assigned to one of two conditions: AI-allowed (Cursor Pro plus Claude 3.5 or 3.7 Sonnet) or AI-forbidden.  The developers logged time honestly.  The data was clean.

The result inverted every prediction.  In the AI-allowed condition, developers took 19% longer on average to complete their tasks.  Not a small effect.  The 95% confidence interval was +2% to +39% — meaning the slowdown is statistically significant and meaningful in size.  And the slowdown was occurring on real work in real repositories, not toy benchmarks.

The reason this result is the keystone of the empirical case is the *self-report contradiction*.  After the experiment, the same developers were asked to estimate the effect.  They reported AI made them 20% *faster* on average.  The actual measurement was 19% slower.  The gap between perceived and actual productivity in this domain is roughly 39 percentage points.

Outside experts were no better.  Economists predicted a 39% speedup.  ML researchers predicted a 38% speedup.  Both groups were wrong by similar large margins.  The expert prediction was based on a model of AI productivity that did not match reality on real work.

Why?  The METR team's hypothesis is the one this book has been arguing throughout.  AI accelerates the *local* work — typing out code that the model has seen before.  It slows down the *global* work — verifying that the local code does not break invariants the developer is keeping in their head.  Inexperienced developers on unfamiliar codebases may benefit from AI because the local work dominates.  Experienced developers on familiar codebases lose, because the global work dominates and AI does not help.

This is exactly the population doing maintenance.  Experienced developers, working on systems they know, preserving invariants under change.  This is who Lehman wrote his laws about.  This is who Hamilton was building flight software with.  This is who Hoare designed his triples for.  And it is exactly this population that AI tools are now demonstrably slowing down — while inverting their perception of the result.

Twenty percent slower.  Felt twenty percent faster.  The instruments are lying.`
  },
  {
    title: 'The Thesis',
    year: 2026,
    country: 'US',
    class: 'meta',
    gesture: 'Software maintenance is at least NP-hard.  AI helps the easy parts.  Safety-critical software is the existence proof.  The bill is coming due.',
    body: 'This book argues a single load-bearing claim: software maintenance is at least NP-hard, and several of its core subproblems are formally undecidable.  The argument has three layers.  First, the deepest maintenance questions — does this refactor preserve behavior, are these two versions equivalent — are undecidable by Rice\'s theorem, descending from Turing\'s halting result.  Second, the practical maintenance subproblems are NP-hard or NP-complete: register allocation, test suite minimization, module clustering, package dependency resolution, refactoring optimization, type inference for rich systems.  Third, the meta-problem inherits the hardness of its hardest subproblem.  AI is a heuristic.  Heuristics do not change problem complexity.  They change which instances are handled well in practice.  AI handles the local instances; the global ones it degrades.  The empirical evidence — Stanford CCS, GitClear, DORA, METR — is what that mismatch looks like at scale.  Safety-critical software is the existence proof that the trap can be escaped, at the cost of two to three orders of magnitude more effort per line of code.  The industry has refused to pay that cost.  The bill is coming due.',
    cultural: `The present moment.  The discourse around AI productivity is at peak intensity.  The empirical evidence has accumulated to the point that it can be summarized in a single argument.  The industry's investment in AI tools has accumulated to the point that reversing course would be politically costly.  The two trajectories are not yet visibly intersecting.  This book argues they will, and the intersection will be unpleasant.  Whether the intersection is anticipated and managed, or arrived at by collision, depends on whether the discipline Hamilton named is remembered before the bill arrives.`,
    citation: 'Specification: Gauger, A. (2026). *NP-Hard* — Thesis.  Foundation references: Turing 1936, Rice 1953, Cook 1971, Karp 1972, Lehman 1980, Brooks 1986, Klein et al. 2009, METR 2025.',
    link: 'https://github.com/andygauge',
    eli5: `Every page of this book exists to support one sentence: software maintenance is provably hard, AI does not break the proof, and the industry is now experiencing the consequences.

The proof comes in three layers.

The first layer is undecidability.  Turing in 1936 showed that no algorithm can decide whether an arbitrary program halts.  Rice in 1953 generalized this to *every* non-trivial behavioral property.  The questions a maintainer most needs to answer — does this change preserve correctness, does this version behave like the previous one, is this refactoring safe — are exactly the kind of questions Rice ruled out.  No tool, no AI, no formal method makes those questions decidable in the general case.  We can answer them on specific programs by writing specific proofs.  We cannot answer them in general.

The second layer is NP-hardness.  Once we relax the question from "is this correct" to "is this *good*" along measurable axes, the literature has spent forty years proving the resulting optimization problems are NP-hard.  Test suite minimization.  Module clustering.  Package dependency resolution.  Register allocation.  Optimal refactoring.  Type inference for sufficiently rich systems is undecidable; for the tractable variants it is NP-complete.  Every modern package manager runs a SAT solver internally because Di Cosmo proved it had to.  Every compiler approximates an NP-complete problem on every build because Chaitin proved it had to.  Software maintenance is the simultaneous solution of all these subproblems under conflicting constraints.

The third layer is inheritance.  A meta-problem inherits the complexity of its hardest subproblem.  Multiple of the constituent subproblems are NP-hard.  Some are undecidable.  Software maintenance is at least NP-hard.

Now the corollary the book is actually about.  NP-hardness is a property of the *problem*, not the *solver*.  A neural network is a solver.  A SAT solver is a solver.  Heuristics are solvers.  None of them change the problem's complexity — they change which instances they handle well in practice.

LLMs are very good *local* solvers.  They predict the next token from context.  Maintenance is a *global* problem — preserve invariants across the whole codebase under change.  Local solvers struggle with global constraints, and the empirical research is exactly what that mismatch looks like.  Stanford CCS '23: AI-assisted code is less secure, and developers believe the opposite.  GitClear 2024 and 2025: code added up, refactored down, churn doubling, duplication eight-fold.  DORA 2024: throughput slightly up, stability down 7.2%.  METR 2025: experienced developers 19% slower, while reporting 20% faster.

The other half of the book is the existence proof that we *do* know how to escape the NP-hard maintenance trap.  Hoare gave us the proof method.  Hamilton named the discipline.  The Power of 10 codified the rules.  CompCert proved a compiler.  seL4 proved a kernel.  Tokeneer proved an authentication system.  DO-178C is the regulatory regime that requires the discipline for civil aviation.  These projects work.  They produce software that does not degrade.  The cost is two to three orders of magnitude more effort per line of code.

That cost is the price of escaping NP-hardness through proof rather than through testing-and-hope.  Safety-critical software pays it because the alternative is dead patients, dead pilots, dead crews.  The rest of the industry has refused to pay it because the alternative was a refunded subscription.

The asymmetry is the new one.  AI tools push the cost of writing untrusted code toward zero.  They do not push the cost of *proving* code toward zero.  They make the cheap path cheaper and leave the expensive path expensive.  The gap widens.  Maintenance debt compounds.  Stability falls.  Confidence rises faster than competence.  And on the day the cumulative debt rolls over the cumulative productivity gain, the industry will discover what the safety-critical engineers have known since Therac-25: the discipline is not optional.  It is what makes software a profession.

Maintenance is provably hard.  AI helps the easy parts.  The bill is coming due.`
  }
];

export const flat = raw
  .map((s) => ({ ...s }))
  .sort((a, b) => a.year - b.year)
  .map((s, i) => ({ ...s, num: String(i + 1).padStart(2, '0'), orderIndex: i }));

export const YEAR_MIN = Math.min(...flat.map((s) => s.year));
export const YEAR_MAX = Math.max(...flat.map((s) => s.year));

export const CLASSES = ['undecidable', 'NP-complete', 'NP-hard', 'P', 'meta'];

// Convert ISO 3166-1 alpha-2 country code to a flag emoji.
// 'US' → 🇺🇸, 'GB' → 🇬🇧, 'CA' → 🇨🇦, 'AU' → 🇦🇺, 'FR' → 🇫🇷
export function flag(code) {
  if (!code || code.length !== 2) return '';
  const A = 0x1f1e6;
  const upper = code.toUpperCase();
  return String.fromCodePoint(A + upper.charCodeAt(0) - 65, A + upper.charCodeAt(1) - 65);
}

// Normalize the `country` field on a section to an array of ISO codes.
// Accepts a string ('US'), an array (['CA', 'US']), or undefined.
export function countryCodes(country) {
  if (!country) return [];
  return Array.isArray(country) ? country : [country];
}

// Long-form country name for display next to the flag.
export const COUNTRY_NAMES = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  AU: 'Australia',
  FR: 'France',
  DE: 'Germany',
  JP: 'Japan',
  NL: 'Netherlands',
  CH: 'Switzerland'
};

export function countryName(code) {
  return COUNTRY_NAMES[code?.toUpperCase()] || code || '';
}

// Render a country field (string or array) as joined names: "Canada / United States".
export function countryLabel(country) {
  return countryCodes(country).map(countryName).join(' / ');
}

export function next(num) {
  const i = flat.findIndex((s) => s.num === num);
  return i >= 0 && i < flat.length - 1 ? flat[i + 1] : null;
}

export function prev(num) {
  const i = flat.findIndex((s) => s.num === num);
  return i > 0 ? flat[i - 1] : null;
}
