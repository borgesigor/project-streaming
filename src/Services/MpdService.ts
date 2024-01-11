import { DashMPD } from "../Shared/Utils/MpdParser";

interface CreateArgs{
  mediaType: 'live' | 'ondemand' | 'dvr',
  totalResolution: string

}

class Mpd{
  create(args: CreateArgs){

    const [weight, height] = [ args.totalResolution.split('x')[0], args.totalResolution.split('x')[1] ]

    if(args.mediaType == 'ondemand'){
      
    }

    const mpd = new DashMPD
  }
}