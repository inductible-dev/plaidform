export const PI_OVER_ONE_EIGHTY = Math.PI/180;
export const ONE_EIGHTY_OVER_PI = 180/Math.PI ;

export class Ellipse
{
    constructor(a,b) 
    {
        this.a = a;
        this.b = b;
    }

    getPointAtT(t,deg=true)
    {        
        if( deg ) t *= PI_OVER_ONE_EIGHTY;
        return { x: this.a * Math.cos(t), y: this.b * Math.sin(t) };
    }
}

export class BezierSegment
{
    constructor(ppointa, pcvecta, ppointb, pcvectb)
    {
        this.setParams(ppointa, pcvecta, ppointb, pcvectb);
    }

    setParams( ppointa, pcvecta, ppointb, pcvectb )
    {
        if (typeof ppointa === "undefined") ppointa = null;
        if (typeof pcvecta === "undefined") pcvecta = null;
        if (typeof ppointb === "undefined") ppointb = null;
        if (typeof pcvectb === "undefined") pcvectb = null;
        
        this.pointA = ppointa ? ppointa : { x: 0, y: 0 };
        this.controlA = pcvecta ? pcvecta : { x: 0, y: 0 };
        this.pointB = ppointb ? ppointb : { x: 0, y: 0 };
        this.controlB = pcvectb ? pcvectb : { x: 0, y: 0 };

        let vect = { x: this.pointA.x - this.pointB.x, y: this.pointA.y - this.pointB.y };
        this.length = Math.sqrt((vect.x * vect.x) + (vect.y * vect.y));
    };

    B4(t) 
    {
        return (t * t * t);
    }

    B3(t) 
    {
        return (3 * t * t * (1 - t));
    }

    B2(t)
    {
        return (3 * t * (1 - t) * (1 - t));
    }

    B1(t) 
    {
        return ((1 - t) * (1 - t) * (1 - t));
    }

    reset() 
    {
        this.pointA.x = this.pointA.y = 0;
        this.controlA.x = this.controlA.y = 0;
        this.pointB.x = this.pointB.y = 0;
        this.controlB.x = this.controlB.y = 0;
        this.length = 0;
    }

    getPointAtT(t) 
    {
        let x = this.pointA.x * this.B1(t) + this.controlA.x * this.B2(t) + this.controlB.x * this.B3(t) + this.pointB.x * this.B4(t);
        let y = this.pointA.y * this.B1(t) + this.controlA.y * this.B2(t) + this.controlB.y * this.B3(t) + this.pointB.y * this.B4(t);
        return { x: x, y: y };
    }    

}

export class SineOscillator {
    
    constructor(amp, freq, pse) 
    {
        this.amplitude = 0;
        this.frequency = 1;
        this.phase = 0;
        this.stepCtr = 0;
        this.stepCtr = 0;
        this.amplitude = amp;
        this.frequency = freq;
        this.phase = pse;
    }
    
    step(inc) 
    {
        if (typeof inc === "undefined") { inc = 1; }
        this.stepCtr = (this.stepCtr + inc) % 360;
        return this.getValueForT(this.stepCtr);
    }

    getValueForT(t) 
    {
        var rval = this.amplitude * Math.sin(t * this.frequency * PI_OVER_ONE_EIGHTY + this.phase);
        return rval;
    }

    reset() 
    {
        this.stepCtr = 0;
    }

    getValueForTWithVars(t, amp, freq, pse) 
    {
        if (typeof amp === "undefined") { amp = 0; }
        if (typeof freq === "undefined") { freq = 0; }
        if (typeof pse === "undefined") { pse = 0; }
        var rval = amp * Math.sin(t * freq * PI_OVER_ONE_EIGHTY + pse);
        return rval;
    }
}

export function RadToDeg(rad) 
{
    return rad * ONE_EIGHTY_OVER_PI;
}
export function DegToRad(deg) 
{
    return deg * PI_OVER_ONE_EIGHTY;
}

export function rectangleContainsPoint(rect, point) 
{
    if (point.x > rect.x && point.x < rect.x + rect.width) {
        if (point.y > rect.y && point.y < rect.y + rect.height) {
            return true;
        }
    }
    return false;
}