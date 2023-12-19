# f1-elo
### _A stupidly simple F1 Elo system_

Inspired by [this YouTube video](https://www.youtube.com/watch?v=U16a8tdrbII) and [this Medium article](https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53), I decided to try and make my own version of a Formula One Elo system.  
Data was taken from [the Ergast API](http://ergast.com/mrd/).  
Shoutouts to the countless Stack Overflow questions that helped me make this a reality.

As of the time of writing (December 10th, 2023), these are the following rankings from the most recent revision of this algorithm:  
![A chart of the top 10 ratings of Formula One drivers.](https://github.com/LeftistTachyon/f1-elo/assets/24881514/01ffd1a8-8d18-4518-b43f-35f9eaaa2ae1)

If you want to see historical ratings, here you go (it's kinda shaky, mb):  
![Historical rating animation of Formula One drivers.](https://github.com/LeftistTachyon/f1-elo/blob/master/ratings.gif)

Here's the same for constructors:
![Historical rating animation of Formula One constructors.](https://github.com/LeftistTachyon/f1-elo/blob/master/ratings-const.gif)

Comparatively, Lewis Hamilton seems to have the highest Elo gap ever (235.2, equating to a 71.2% "win rate" (outplacing that competitor) against #2), followed by Michael Schumacher (192.4) and Juan Manuel Fangio (123.2). However, Max Verstappen seems to be quickly closing in on Hamilton's historic lead with his recent streak.
