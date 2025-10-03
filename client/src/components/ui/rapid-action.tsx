import { Link, useNavigate } from "react-router-dom"

export const RapidAction = ()=>{
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token"); // borra token
        navigate("/login"); // redirige al login
  };
    return(
        <>
        <div className="fab fab-flower">
            {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
            <div tabIndex={0} role="button" className="btn btn-success btn-lg rounded-4xl">
                <p>Acciones Rapidas</p>
            </div>

            {/* Main Action button replaces the original button when FAB is open */}
            <button className="fab-main-action btn  btn-lg btn-neutral rounded-4xl">
                <p>Acciones Rapidas</p>
            </button>

            {/* buttons that show up when FAB is open */}
            <Link to={"turnos"}><button className="btn  btn-success rounded-4xl btn-lg drop-shadow-2xl">
                <p>Gestion de turnos</p>
            </button></Link>
            <Link to={"pacientes"}><button className="btn btn-success rounded-4xl btn-lg drop-shadow-2xl">
                <p>Gestion de pacientes</p>
            </button></Link>
            <button onClick={()=>{handleLogout()}} className="btn btn-error rounded-4xl btn-lg">
                <p>Salir</p>
            </button>
            
        </div>
        </>
    )
}