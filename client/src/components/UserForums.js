import { ForumCard } from "./ForumSearch/ForumCard";
import { ForumSwiperComponent } from "./ForumSearch/ForumSwiper";
import { Typography } from '@mui/material';


export function UserForums({user, userForums, onChange}) {
    return (
        <>
        <Typography variant="h2" component="body" style={{color: '#daaa00', fontSize: '4rem'}}>
            Your Forums
        </Typography>
        <div style={{height: '25px'}}/>
        <div style={{marginInline: "auto", maxWidth: "95%"}}>
            {user === null ? (
                <Typography align="center" style={{color: "#561d25", fontSize: 18}}>Loading...</Typography>
            ) : (
                (userForums.length === 0) ? (
                    <Typography align="center" style={{color: "#561d25", fontSize: 18}}>You have not saved any forums yet!</Typography>
                ) : (
                    <>
                        <ForumSwiperComponent
                            slides={userForums.map((forum) => (
                                <ForumCard key={forum._id} user={user} forum={forum} joined={user.savedForums.includes(forum._id)} onChange={onChange}> </ForumCard>
                            ))}>
                        </ForumSwiperComponent>
                    </>
                )
            )}
        </div>
        </>
    );
}