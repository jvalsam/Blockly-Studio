/**
 * SmartObjectModel - 
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * August 2017
 */

export class SOProperties {
  
}

export class SmartObjectModel {
  constructor(
    private name: string,
    private description: string,
    private imagePath: string,
    private properties: SOProperties
  ) {}

}
