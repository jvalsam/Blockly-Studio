var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Debugger = require('./Debugger');
var _ = require('lodash');


router.put("/add", function(req, res){ 
    let schema = Object.assign({}, req.body);
    Debugger.findOne({'systemID': schema.systemID}, function (err, inst) {
        if(err) return res.status(500).send("There was a problem add this breakpoint.  " + err);
        if(inst === null)                        
            inst = new Debugger(schema);
        else
            inst.breakpoints = _.concat(inst.breakpoints, schema.breakpoints);
        inst.save(function (err) {
            if (err) return res.status(500).send("There was a problem add this breakpoint.  " + err);
            else return res.status(200).send(inst);    
        });           
    });    
});


router.delete("/remove", function(req, res){        
    let schema = Object.assign({}, req.body);
    Debugger.findOne({'systemID': schema.systemID}, function (err, inst) {
        if (err) return res.status(500).send("There was a problem deleting this breakpoint." + err);
        if(inst === null) return res.status(404).send("There is not any breakpoint on this editor instance."); 
        var index = inst.breakpoints.map(function(e) { return e.block_id; }).indexOf(schema.breakpoints[0].block_id);
        if (index > -1) inst.breakpoints.splice(index, 1);       
        if(_.isEmpty(inst.breakpoints)){
            inst.remove(function (err){
                if(err) return res.status(500).send("There was a problem deleting this breakpoint." + err);
                else return res.status(200).send("All the breakpoints from this editor instance was deleted.");
            });
            return;
        }
        inst.save(function (err) {
            if (err) return res.status(500).send("There was a problem deleting this breakpoint.  " + err);
            else return res.status(200).send(inst);            
        });
    });
});


router.delete("/remove/all", function(req, res){        
    let schema = Object.assign({}, req.body);
    Debugger.findOneAndRemove({'systemID': schema.systemID}, function (err, inst) {
        if (err) return res.status(500).send("There was a problem deleting the breakpoints.");
        inst.save(function (err) {
            if (err) return res.status(500).send("There was a problem deleting the breakpoints.  " + err);
            else return res.status(200).send("Breakpoints from this editor instance (" + schema.systemID + ") was deleted.");           
        });
    });
});


router.put("/enable", function(req, res){ 
    let schema = Object.assign({}, req.body);        
    Debugger.findOne({'systemID': schema.systemID}, function (err, inst) {
        if (err) return res.status(500).send("There was a problem enabling this breakpoint.");
        if(inst === null) return res.status(404).send("There is not any breakpoint on this editor instance."); 
        inst.breakpoints.map(function(e) { 
            if(e.block_id === schema.breakpoints[0].block_id)
                e.enabled = true; 
        });
        inst.save(function (err) {
            if (err) return res.status(500).send("There was a problem enabling this breakpoint.  " + err);
            else return res.status(200).send(inst);           
        });
    });
});


router.put("/enable/all", function(req, res){     
    let schema = Object.assign({}, req.body);   
    Debugger.findOne({'systemID': schema.systemID}, function (err, inst) {
        if (err) return res.status(500).send("There was a problem enabling the breakpoints.");
        if(inst === null) return res.status(404).send("There is not any breakpoint on this editor instance."); 

        _.forEach(inst.breakpoints, function(br) {
           br.enabled = true;
        });
        inst.save(function (err) {
            if (err) return res.status(500).send("There was a problem enabling this breakpoint.  " + err);
            else return res.status(200).send(inst);            
        });
    });
});


router.put("/disable", function(req, res){       
    let schema = Object.assign({}, req.body); 
    Debugger.findOne({'systemID': schema.systemID}, function (err, inst) {
        if (err) return res.status(500).send("There was a problem disabling this breakpoint.");
        if(inst === null) return res.status(404).send("There is not any breakpoint on this editor instance."); 
        inst.breakpoints.map(function(e) { 
            if(e.block_id === schema.breakpoints[0].block_id)
                e.enabled = false; 
        });
        inst.save(function (err) {
            if (err) return res.status(500).send("There was a problem disabling this breakpoint.  " + err);
            else return res.status(200).send(inst);           
        });
    }); 
});


router.put("/disable/all", function(req, res){        
    let schema = Object.assign({}, req.body);   
    Debugger.findOne({'systemID': schema.systemID}, function (err, inst) {
        if (err) return res.status(500).send("There was a problem disabling the breakpoints.");
        if(inst === null) return res.status(404).send("There is not any breakpoint on this editor instance."); 

        _.forEach(inst.breakpoints, function(br) {
           br.enabled = false;
        });
        inst.save(function (err) {
            if (err) return res.status(500).send("There was a problem disabling this breakpoint.  " + err);
            else return res.status(200).send(inst);            
        });
    });
});


module.exports = router;