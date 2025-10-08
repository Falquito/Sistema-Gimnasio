type Tab="turnos" | "pacientes" | "horarios" | "especialidades" | "servicios" 
interface Props{
    activeTab:Tab;
    onTabChange:(tab:Tab)=>void;

}

const tabs:{id:Tab; label:string}[]=[
    {id:"turnos", label:"Turnos"},
    {id:"pacientes", label:"Pacientes"},
    {id:"horarios", label:"Horarios"},
    {id:"especialidades", label:"Especialidades"},

    
];

export function TabNavigation({activeTab, onTabChange}:Props){
    return(
        <div className="bg-gray-100 rounded-lg border border-gray-200 p-1 flex gap-1 w-full" >
            {tabs.map((tab)=>(
                <button
                key={tab.id}
                onClick={()=> onTabChange(tab.id)}
                className={`flex-1 px-6 py-2 rounded-lg ${
                    activeTab===tab.id
                    ? "bg-white text-black"
                    :"text-gray-600 hover:bg-gray-100"
                }`}
                > {tab.label}</button>

            ))}
        </div>
    )
}