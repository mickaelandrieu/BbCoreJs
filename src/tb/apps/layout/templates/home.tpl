<div class="row">
    <div class="col-md-6">
        <p> this is my applicationName {{appName}}</p>
        <p> this my template name {{templateName}}</p>
        <a data-action="layout:list" href="javascript:;">Go to layout test controller</a>
        <p>{{radical}}</p>
        <p class="sred"> strange indeed</p>
        <p class="sred"><a href="#appLayout/showlist/52">link with params</p>
        <p class="sred"><a class="btn show-tree-view" href="#">show Tree view </p>
        <p class="sred"><a class="btn show-tree-view-popup" href="#">show Tree view using popin</p>
        <br/><br/>
            <p><a class="add_node_append">A node with append </a></p>
            <p><a class="add_node_before">A node before</a></p>
            <p><a class="add_node_after">A node after</a></p>
            <p class="data-list-btn">Show a data list</p>

    </div>
    <div class="col-md-6">
        <style type="text/css">
            .selected {
                cursor: pointer;
                border: 1px solid red
            }
        </style>
        <div id='data-list' style="margin-top:50px"></div>
    </div>
</div>