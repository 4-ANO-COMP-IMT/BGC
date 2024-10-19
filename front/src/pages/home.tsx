import { Button } from "@/components/ui/button";
import { LampContainer } from "@/components/ui/lamp";
import { UserContext } from "@/contexts/user-context";
import { motion } from "framer-motion";
import { useContext } from "react";

function Home() {
  const { isLogged } = useContext(UserContext);

  return (
    <LampContainer className="pt-96 h-screen">
      <div className="flex flex-col items-center h-full pt-48">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-20 bg-gradient-to-br from-stone-600 to-black py-10 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Nós Transformamos Conversas <br /> em{" "}
          <span className="bg-gradient-to-br from-sky-400 to-blue-800 py-10 bg-clip-text text-center font-medium tracking-tight text-transparent">
            Memória Eficiente
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="md:w-1/2 text-center text-xl text-muted-foreground"
        >
          Simplifique suas reuniões com a clareza e a praticidade da Briefify.
          Diga adeus ao caos e dê boas-vindas a atas automáticas, detalhadas e
          precisas, tudo ao alcance de um clique.
        </motion.p>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="w-1/2 pt-10 flex flex-row justify-around"
        >
          <Button disabled variant={"ghost"} size={"lg"}>
            Criar Reunião
          </Button>
          <Button
            disabled={!isLogged}
            onClick={() => {
              if (isLogged) {
                window.location.replace("/meeting");
              }
            }}
          >
            Entrar em Reunião
          </Button>
        </motion.div>
      </div>
    </LampContainer>
  );
}

export default Home;
