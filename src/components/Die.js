export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? '#59E391' : 'white',
    };

    let dots = [];
    let nameClass = `dot dot${props.value}`;
    for (let i = 0; i < props.value; i++) {
        dots.push(<div key={i} className={nameClass}></div>);
    }

    return (
        <div className="die">
        <div className="inner" style={styles} onClick={props.click}>
            {dots}
        </div>
        </div>
    );
}