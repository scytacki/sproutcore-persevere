// ==========================================================================
// Project:   Example.Project Fixtures
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Example */

sc_require('models/project');

Example.Project.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.
  { guid: 'udl',
    name: 'UDL',
    products: ['java-graph']},
  { guid: 'rites',
    name: 'RITES',
    products: ['rails-portal', 'java-graph']},
  { guid: 'geniverse',
    name: 'Geniverse',
    products: ['rails-portal', 'sproutcore']}

  // { guid: 1,
  //   firstName: "Michael",
  //   lastName: "Scott" },
  //
  // { guid: 2,
  //   firstName: "Dwight",
  //   lastName: "Schrute" },
  //
  // { guid: 3,
  //   firstName: "Jim",
  //   lastName: "Halpert" },
  //
  // { guid: 4,
  //   firstName: "Pam",
  //   lastName: "Beesly" },
  //
  // { guid: 5,
  //   firstName: "Ryan",
  //   lastName: "Howard" }

];
