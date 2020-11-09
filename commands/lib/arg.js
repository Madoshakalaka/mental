/**
 *
 * @param {Array<string>} args
 * @return {Array<string>}
 */
function stripMentions(args){
    return args.filter(v=> ! (v.startsWith('<') && v.endsWith('>')))
}



module.exports = {stripMentions}