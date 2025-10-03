import { CardBody, CardContainer, CardItem } from "./ui/3d-card"
import ColourfulText from "./ui/colourful-text"
import { ContainerTextFlip } from "./ui/container-text-flip"

export const Card3D = ({titulo,img,subtitulo,textBody}:{titulo:string,subtitulo:string,textBody:string;})=>{
    return(
        <>
        <CardContainer className="inter-var perspective-[2000px] border border-emerald-500 rounded-xl drop-shadow-2xl">
                <CardBody className="bg-gray-50 relative group/card  
                    dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] 
                    dark:bg-black dark:border-white/[0.2] border-black/[0.1] 
                    w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  
                    transition-transform duration-300"
                >
                    <CardItem
                        translateZ="50"
                        className="text-xl font-bold text-emerald-500 dark:text-white"
                    >
                        {titulo}
                    </CardItem>

                    {subtitulo?<CardItem
                        as="p"
                        translateZ="60"
                        className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                        Hover over this card to unleash the power of CSS perspective
                    </CardItem>:""}

                    {img?<CardItem translateZ="100" className="w-full mt-4">
                        <img
                            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
                            height="1000"
                            width="1000"
                            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                            alt="thumbnail"
                        />
                    </CardItem>:""}

                    <CardItem translateZ="100" className="w-full mt-4">
                        <ColourfulText text={textBody}></ColourfulText>
                    </CardItem>


                    
                </CardBody>
            </CardContainer>
        </>
    )
}