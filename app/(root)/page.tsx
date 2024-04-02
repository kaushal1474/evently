import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="bg-primary-50 py-5 md:py-10 bg-dotted-pattern bg-contain">
        <div className="wrapper grid grid-cols-1 md:grid-cols-2 gap-5 2xl:gap-0">
          <div className="flex flex-col gap-8 justify-center">
            <h1 className="h1-bold ">
              Host, Connect, Celebrates: Your Events, Our platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community.</p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>

          <div>
            <Image
              src="/assets/images/hero.png"
              alt="hero"
              width={1000}
              height={1000}
              className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
            />
          </div>
        </div>
      </section>
      <section id="events" className="wrapper flex flex-col my-8 gap-8 md:gap-12">
        <h2 className="h2-bold">Trusted by <br /> Thousands of events</h2>
        <div className="flex flex-col md:flex-row gap-5 w-full">
          Search
          Category
        </div>
      </section>
    </main>
  );
}
